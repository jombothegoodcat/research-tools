class ProxyRedirector {
    constructor() {
        this.proxies = [
            'https://api.allorigins.win/raw?url=',
            'https://corsproxy.io/?',
            'https://www.cors-proxy.org/proxy?url='
        ];
        
        this.currentProxyIndex = 0;
        this.init();
    }

    init() {
        document.getElementById('directAccess').addEventListener('click', () => {
            this.redirectThroughProxy();
        });

        document.getElementById('customProxy').addEventListener('click', () => {
            this.toggleCustomProxyForm();
        });

        document.getElementById('useCustomProxy').addEventListener('click', () => {
            this.useCustomProxy();
        });

        this.updateStatus('Ready for authorized testing. Select an access method.');
    }

    redirectThroughProxy(proxyUrl = null) {
        const targetUrl = 'https://chatgpt.com/';
        let proxy;
        
        if (proxyUrl) {
            proxy = proxyUrl;
        } else {
            proxy = this.proxies[this.currentProxyIndex];
            this.currentProxyIndex = (this.currentProxyIndex + 1) % this.proxies.length;
        }

        const finalUrl = proxy + encodeURIComponent(targetUrl);
        
        this.updateStatus(`Redirecting through proxy: ${proxy}...`);
        
        // Add a small delay to show the status message
        setTimeout(() => {
            window.location.href = finalUrl;
        }, 1000);
    }

    toggleCustomProxyForm() {
        const form = document.getElementById('proxyForm');
        const isHidden = form.style.display === 'none';
        form.style.display = isHidden ? 'block' : 'none';
        
        if (isHidden) {
            this.updateStatus('Enter a custom proxy URL in the format: https://proxy.com/?url=');
        }
    }

    useCustomProxy() {
        const proxyUrl = document.getElementById('proxyUrl').value.trim();
        
        if (!proxyUrl) {
            this.updateStatus('Please enter a proxy URL');
            return;
        }

        if (!proxyUrl.startsWith('https://')) {
            this.updateStatus('Proxy URL must start with https://');
            return;
        }

        this.redirectThroughProxy(proxyUrl);
    }

    updateStatus(message) {
        document.getElementById('status').textContent = message;
    }
}

// Service Worker Registration for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('./sw.js')
        .then(function(registration) {
            console.log('ServiceWorker registration successful');
        })
        .catch(function(error) {
            console.log('ServiceWorker registration failed: ', error);
        });
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new ProxyRedirector();
});