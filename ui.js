/**
 * Mintwave UI Components
 * Custom Modals and Notifications
 */

const UI = {
  /**
   * Show a custom modal with a title, message, and buttons
   * @param {Object} options - { title, message, type: 'info'|'error'|'success'|'confirm', onConfirm, onCancel }
   */
  modal: function(options) {
    // Remove existing modal if any
    const existing = document.getElementById('ui-modal-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'ui-modal-overlay';
    overlay.className = 'fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-6 animate-in fade-in duration-300';
    
    const isConfirm = options.type === 'confirm';
    const accentColor = options.type === 'error' ? 'red-500' : options.type === 'success' ? 'emerald-400' : 'cyan-400';

    overlay.innerHTML = `
      <div class="w-full max-w-md rounded-[2.5rem] bg-[#101020] border border-white/10 p-8 shadow-2xl transform animate-in zoom-in-95 duration-300">
        <div class="flex flex-col items-center text-center">
          <div class="mb-6 rounded-2xl bg-${accentColor}/10 p-4 text-${accentColor}">
            ${this._getIcon(options.type)}
          </div>
          <h3 class="text-2xl font-black text-white mb-3">${options.title || 'Notification'}</h3>
          <p class="text-slate-400 leading-relaxed mb-8">${options.message}</p>
          
          <div class="flex w-full gap-3">
            ${isConfirm ? `
              <button id="modal-cancel" class="flex-1 rounded-full border border-white/10 bg-white/5 py-4 font-bold text-white hover:bg-white/10 transition-colors">
                Cancel
              </button>
            ` : ''}
            <button id="modal-ok" class="flex-1 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 py-4 font-black text-white hover:opacity-90 transition-opacity">
              ${isConfirm ? 'Confirm' : 'Got it'}
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    return new Promise((resolve) => {
      document.getElementById('modal-ok').onclick = () => {
        overlay.remove();
        if (options.onConfirm) options.onConfirm();
        resolve(true);
      };

      if (isConfirm) {
        document.getElementById('modal-cancel').onclick = () => {
          overlay.remove();
          if (options.onCancel) options.onCancel();
          resolve(false);
        };
      }
    });
  },

  /**
   * Show a temporary notification (toast)
   * @param {string} message - Message to display
   * @param {string} type - 'success' | 'error' | 'info'
   */
  toast: function(message, type = 'success') {
    const toast = document.createElement('div');
    const accentColor = type === 'error' ? 'red-400' : 'emerald-400';
    
    toast.className = `fixed bottom-6 right-6 z-[100] max-w-sm rounded-3xl border border-${accentColor}/20 bg-[#101020] p-5 shadow-2xl transform transition-all duration-500 translate-y-20 opacity-0`;
    toast.innerHTML = `
      <div class="flex items-center gap-4">
        <div class="rounded-xl bg-${accentColor}/10 p-2 text-${accentColor}">
          ${this._getIcon(type, 'h-5 w-5')}
        </div>
        <div>
          <p class="font-black text-white text-sm">${type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Notification'}</p>
          <p class="text-xs text-slate-400 mt-1">${message}</p>
        </div>
      </div>
    `;

    document.body.appendChild(toast);

    // Trigger animation
    setTimeout(() => {
      toast.classList.remove('translate-y-20', 'opacity-0');
    }, 100);

    // Remove after delay
    setTimeout(() => {
      toast.classList.add('translate-y-20', 'opacity-0');
      setTimeout(() => toast.remove(), 500);
    }, 4000);
  },

  _getIcon: function(type, size = 'h-8 w-8') {
    switch(type) {
      case 'error':
        return `<svg class="${size}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
      case 'success':
        return `<svg class="${size}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`;
      case 'confirm':
        return `<svg class="${size}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
      default:
        return `<svg class="${size}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
    }
  }
};

// Global polyfills for easier migration
window.alert = (msg) => UI.modal({ title: 'Alert', message: msg, type: 'info' });
window.confirmModal = (title, msg) => UI.modal({ title, message: msg, type: 'confirm' });
