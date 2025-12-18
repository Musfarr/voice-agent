import { useEffect, useRef, useState } from 'react';
import {
  ConnectionState,
  Room,
  Track,
  createLocalAudioTrack,
} from 'livekit-client';
import { createSession, AGENT_BASE_URL } from '../services/api';

export default function LiveDemo() {
  const roomRef = useRef(null);
  const remoteAudioContainerRef = useRef(null);
  const [status, setStatus] = useState('Idle');
  const [logs, setLogs] = useState([]);
  const [isJoining, setIsJoining] = useState(false);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState(null);

  const appendLog = (message) => {
    setLogs((prev) => [message, ...prev].slice(0, 30));
  };

  const detachAllTracks = () => {
    const room = roomRef.current;
    if (!room) return;
    room.participants.forEach((participant) => {
      participant.tracks.forEach((pub) => {
        pub.track?.detach().forEach((el) => el.remove());
      });
    });
    room.localParticipant.tracks.forEach((pub) => {
      pub.track?.detach().forEach((el) => el.remove());
    });
    remoteAudioContainerRef.current?.replaceChildren();
  };

  const leaveRoom = async () => {
    const room = roomRef.current;
    if (room) {
      room.disconnect();
      detachAllTracks();
      roomRef.current = null;
    }
    setJoined(false);
    setStatus('Idle');
  };

  useEffect(() => {
    return () => {
      leaveRoom();
    };
  }, []);

  const joinRoom = async () => {
    setIsJoining(true);
    setError(null);
    appendLog('Requesting session token...');
    setStatus('Requesting token');

    try {
      const data = await createSession();
      appendLog(`Received token for room ${data.room_name}`);
      setStatus('Connecting to room');

      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
      });

      room.on('connectionStateChanged', (state) => {
        setStatus(`Connection: ${state}`);
        appendLog(`Connection state: ${state}`);
        if (state === ConnectionState.Disconnected) {
          setJoined(false);
        }
      });

      room.on('reconnecting', () => appendLog('Reconnecting...'));
      room.on('reconnected', () => appendLog('Reconnected'));
      room.on('disconnected', () => appendLog('Disconnected'));

      room.on('trackSubscribed', (track, publication, participant) => {
        appendLog(`Subscribed to ${track.kind} from ${participant.identity}`);
        if (track.kind === Track.Kind.Audio) {
          const audioEl = track.attach();
          audioEl.autoplay = true;
          audioEl.controls = true;
          remoteAudioContainerRef.current?.appendChild(audioEl);
        }
      });

      room.on('trackUnsubscribed', (track) => {
        appendLog(`Track unsubscribed (${track.kind})`);
        track.detach().forEach((el) => el.remove());
      });

      roomRef.current = room;

      await room.connect(data.livekit_url, data.access_token, { autoSubscribe: true });
      appendLog('Connected to room');
      setStatus('Connected — creating mic track');

      const localAudioTrack = await createLocalAudioTrack({
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      });
      appendLog('Microphone captured');

      await room.localParticipant.publishTrack(localAudioTrack);
      appendLog('Microphone published');
      setJoined(true);
      setStatus('Live — talking to agent');
    } catch (err) {
      const message = err?.message ?? 'Join failed';
      setError(message);
      appendLog(`Error: ${message}`);
      await leaveRoom();
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="container">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
        <div>
          <h4 className="mb-1">Live Voice Demo</h4>
          <small className="text-muted">Talk to a live calling agent</small>
        </div>
        {/* <span className="badge bg-light text-dark px-3 py-2">{status}</span> */}
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                {/* <div>
                  <h5 className="card-title mb-1">Call Controls</h5>
                  <p className="text-muted mb-3">
                    Requests a token from your server at <code>{AGENT_BASE_URL}sessions/create</code>, then connects and publishes your microphone.
                  </p>
                </div> */}
                {/* <span className={`badge ${joined ? 'bg-success' : 'bg-secondary'} px-3 py-2`} aria-label="Call state badge">
                  {joined ? 'In Call' : 'Not in Call'}
                </span> */}
              </div>

              {error && (
                <div className="alert alert-danger py-2 px-3" role="alert">
                  {error}
                </div>
              )}

              <div className="d-flex gap-2 mb-3">
                <button className="btn btn-dark" onClick={joinRoom} disabled={isJoining || joined} aria-label="Join LiveKit room">
                  {isJoining ? 'Joining...' : 'Join Call'}
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => leaveRoom()}
                  disabled={!joined}
                  aria-label="Leave LiveKit room"
                >
                  End Call
                </button>
              </div>

              <div className="p-3 border rounded bg-light">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="status-dot" style={{ backgroundColor: joined ? '#7cb342' : '#e57373' }} />
                  <strong className="small mb-0">{joined ? 'Live with agent' : 'Waiting to join'}</strong>
                </div>
                <p className="mb-0 text-muted small">Ensure your microphone is allowed. Remote audio tracks will appear below and auto-play.</p>
              </div>

              <div className="mt-3">
                <h6 className="mb-2">Remote Audio</h6>
                <div
                  ref={remoteAudioContainerRef}
                  className="d-flex flex-column gap-2 p-3 border rounded bg-white"
                  style={{ minHeight: 80 }}
                >
                  <span className="text-muted small">Remote participant audio will show here.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title mb-3">Activity Log</h5>
              <div className="border rounded bg-light p-3" style={{ minHeight: 200, maxHeight: 360, overflowY: 'auto' }}>
                {logs.length === 0 ? (
                  <p className="text-muted mb-0">No activity yet. Join the call to see events.</p>
                ) : (
                  <ul className="list-unstyled mb-0">
                    {logs.map((item, idx) => (
                      <li key={idx} className="mb-2 d-flex align-items-start gap-2">
                        <span className="badge bg-dark-subtle text-dark-emphasis">•</span>
                        <span className="small">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
