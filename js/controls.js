(() => {
  'use strict';

  const state = new Map();
  let activeGamepad = null;
  const status = () => document.getElementById('controllerStatus');

  function setKey(code, pressed) {
    if (state.get(code) === pressed) return;
    state.set(code, pressed);
    window.dispatchEvent(new KeyboardEvent(pressed ? 'keydown' : 'keyup', {
      code,
      key: code,
      bubbles: true,
      cancelable: true
    }));
  }

  function clearPadKeys() {
    ['ArrowLeft','ArrowRight','Space','ShiftLeft'].forEach(code => setKey(code, false));
  }

  function updateStatus(gamepad) {
    const el = status();
    if (!el) return;
    if (gamepad) {
      el.textContent = `Xboxコントローラー接続: ${gamepad.id}`;
      el.classList.add('controller-on');
    } else {
      el.textContent = 'スマホ / キーボード / Xboxコントローラー対応';
      el.classList.remove('controller-on');
    }
  }

  function poll() {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    let gp = activeGamepad !== null ? pads[activeGamepad] : null;
    if (!gp) {
      gp = Array.from(pads).find(Boolean) || null;
      activeGamepad = gp ? gp.index : null;
    }

    if (gp) {
      const x = gp.axes?.[0] ?? 0;
      const left = x < -0.28 || !!gp.buttons?.[14]?.pressed;
      const right = x > 0.28 || !!gp.buttons?.[15]?.pressed;
      const jump = !!gp.buttons?.[0]?.pressed;
      const dash = !!gp.buttons?.[2]?.pressed || !!gp.buttons?.[7]?.pressed;

      setKey('ArrowLeft', left && !right);
      setKey('ArrowRight', right && !left);
      setKey('Space', jump);
      setKey('ShiftLeft', dash);
    } else {
      clearPadKeys();
    }

    requestAnimationFrame(poll);
  }

  window.addEventListener('gamepadconnected', e => {
    activeGamepad = e.gamepad.index;
    updateStatus(e.gamepad);
  });

  window.addEventListener('gamepaddisconnected', e => {
    if (activeGamepad === e.gamepad.index) activeGamepad = null;
    clearPadKeys();
    updateStatus(null);
  });

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.touch-controls button').forEach(btn => {
      const down = e => {
        e.preventDefault();
        btn.classList.add('pressed');
        try { btn.setPointerCapture(e.pointerId); } catch (_) {}
      };
      const up = e => {
        e.preventDefault();
        btn.classList.remove('pressed');
        try { btn.releasePointerCapture(e.pointerId); } catch (_) {}
      };
      btn.addEventListener('pointerdown', down, { passive: false });
      btn.addEventListener('pointerup', up, { passive: false });
      btn.addEventListener('pointercancel', up, { passive: false });
      btn.addEventListener('lostpointercapture', up, { passive: false });
      btn.addEventListener('contextmenu', e => e.preventDefault());
    });
  });

  ['gesturestart','gesturechange','gestureend'].forEach(type => {
    document.addEventListener(type, e => e.preventDefault(), { passive: false });
  });

  requestAnimationFrame(poll);
})();
