/**
 * SION MUSIC ACADEMY - AUDIO EXPERIENCE ENGINE (BRIGHT MODERN THEME)
 * Pure Web Audio API Synthesizer & Canvas Soundwave Visualizer
 * Zero external audio dependencies - 100% lightweight & offline-ready
 */

(function() {
  'use strict';

  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Audio Context singleton
  let audioCtx = null;
  let ambientGainNode = null;
  let ambientOscillators = [];
  let isAmbientPlaying = false;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // =========================================================================
  // Instrument Sound Preview Synthesis
  // =========================================================================
  window.SionAudio = {
    // 1. Piano Sound Synthesis (Rich multi-harmonic decaying chord)
    playPianoChord: function() {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // Cmaj9 chord: C4 (261.63), E4 (329.63), G4 (392.00), B4 (493.88), D5 (587.33)
      const freqs = [261.63, 329.63, 392.00, 493.88, 587.33];

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        // Lowpass filter simulating acoustic piano body
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2800, now);
        filter.frequency.exponentialRampToValueAtTime(300, now + 2.2);

        // Envelope
        gain.gain.setValueAtTime(0.001, now + idx * 0.04);
        gain.gain.linearRampToValueAtTime(0.18 / (idx * 0.3 + 1), now + idx * 0.04 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 2.4);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 2.5);
      });
    },

    // 2. Guitar Pluck Synthesis (Acoustic strings with fast attack)
    playGuitarPluck: function() {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // E minor 7 strum: E3, B3, E4, G4, D5
      const freqs = [164.81, 246.94, 329.63, 392.00, 587.33];

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(freq * 2, now);
        filter.Q.setValueAtTime(3, now);

        gain.gain.setValueAtTime(0.001, now + idx * 0.05);
        gain.gain.linearRampToValueAtTime(0.14, now + idx * 0.05 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 1.8);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 1.9);
      });
    },

    // 3. Saxophone Warm Note Synthesis (Expressive vibrato & warm tone)
    playSaxophoneNote: function() {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const baseFreq = 349.23; // F4 note

      const osc = ctx.createOscillator();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(baseFreq, now);

      // Vibrato LFO at 5.5 Hz
      lfo.frequency.setValueAtTime(5.5, now);
      lfoGain.gain.setValueAtTime(0, now);
      lfoGain.gain.linearRampToValueAtTime(4.5, now + 0.4);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      // Horn formant filter
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1100, now);
      filter.Q.setValueAtTime(1.8, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.25);
      gain.gain.setValueAtTime(0.18, now + 1.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      lfo.start(now);
      osc.start(now);
      lfo.stop(now + 1.85);
      osc.stop(now + 1.85);
    },

    // 4. Organ Drawbar Chord Synthesis (Layered harmonics)
    playOrganChord: function() {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // Rich G major chord: G3, B3, D4, G4
      const notes = [196.00, 246.94, 293.66, 392.00];

      notes.forEach(note => {
        [1, 2, 3].forEach((mult, mIdx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(note * mult, now);

          const vol = (0.08 / (mIdx + 1));
          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(vol, now + 0.05);
          gain.gain.setValueAtTime(vol, now + 1.2);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.9);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 2.0);
        });
      });
    },

    // 5. Vocal Warm Melodic Chime
    playVocalChime: function() {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      [440.0, 554.37, 659.25].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.001, now + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.1 + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.1 + 1.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 1.7);
      });
    },

    // Toggle Ambient Background Melody
    toggleAmbient: function(btnElement) {
      const ctx = getAudioContext();
      if (!ctx) return;

      if (isAmbientPlaying) {
        if (ambientGainNode) {
          ambientGainNode.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
          setTimeout(() => {
            ambientOscillators.forEach(osc => {
              try { osc.stop(); } catch(e) {}
            });
            ambientOscillators = [];
            isAmbientPlaying = false;
            if (btnElement) {
              btnElement.classList.remove('is-playing');
              btnElement.setAttribute('aria-pressed', 'false');
            }
          }, 850);
        }
      } else {
        const freqs = [130.81, 196.00, 261.63, 329.63, 392.00, 523.25];
        ambientGainNode = ctx.createGain();
        ambientGainNode.gain.setValueAtTime(0.0001, ctx.currentTime);
        ambientGainNode.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 1.5);

        ambientOscillators = freqs.map((freq, i) => {
          const osc = ctx.createOscillator();
          const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
          const oscGain = ctx.createGain();

          osc.type = i % 2 === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          osc.detune.setValueAtTime((i - 2.5) * 3, ctx.currentTime);

          oscGain.gain.setValueAtTime(1 / (i + 2), ctx.currentTime);

          if (panner) {
            panner.pan.setValueAtTime((i / freqs.length) * 1.6 - 0.8, ctx.currentTime);
            osc.connect(oscGain);
            oscGain.connect(panner);
            panner.connect(ambientGainNode);
          } else {
            osc.connect(oscGain);
            oscGain.connect(ambientGainNode);
          }

          osc.start();
          return osc;
        });

        ambientGainNode.connect(ctx.destination);
        isAmbientPlaying = true;
        if (btnElement) {
          btnElement.classList.add('is-playing');
          btnElement.setAttribute('aria-pressed', 'true');
        }
      }
    }
  };

  // =========================================================================
  // Canvas Soundwave Visualizer in Hero (Bright, Airy Sine Harmonics)
  // =========================================================================
  function initHeroSoundwaveCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let step = 0;

    function resize() {
      canvas.width = canvas.parentElement.offsetWidth || window.innerWidth;
      canvas.height = canvas.parentElement.offsetHeight || 750;
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Subtle, soft waves for bright theme
    const waves = [
      { color: 'rgba(2, 132, 199, 0.16)', speed: 0.012, length: 0.004, amplitude: 38, yOffset: 0.58 },
      { color: 'rgba(124, 58, 237, 0.12)', speed: 0.016, length: 0.007, amplitude: 30, yOffset: 0.62 },
      { color: 'rgba(14, 165, 233, 0.14)', speed: 0.009, length: 0.005, amplitude: 44, yOffset: 0.54 }
    ];

    let isVisible = true;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animationFrameId) {
          render();
        }
      });
    }, { threshold: 0.1 });

    observer.observe(canvas);

    function render() {
      if (!isVisible) {
        animationFrameId = null;
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      step += 1;

      const w = canvas.width;
      const h = canvas.height;

      waves.forEach(wave => {
        ctx.beginPath();
        ctx.moveTo(0, h);

        const baseY = h * wave.yOffset;
        for (let x = 0; x <= w; x += 6) {
          const y = baseY + Math.sin(x * wave.length + step * wave.speed) * wave.amplitude +
                    Math.cos(x * 0.002 + step * (wave.speed * 0.5)) * (wave.amplitude * 0.35);
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.strokeStyle = wave.color;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    }

    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroSoundwaveCanvas);
  } else {
    initHeroSoundwaveCanvas();
  }

})();
