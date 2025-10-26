// Proxy service configurations
const proxyServices = {
    croxyproxy: {
        name: "CroxyProxy",
        url: "https://www.croxyproxy.com/",
        format: (targetUrl) => {
            // Remove protocol and www if present
            const cleanUrl = targetUrl.replace(/^https?:\/\/(www\.)?/, '');
            return `https://www.croxyproxy.com/${cleanUrl}`;
        }
    },
    croxynet: {
        name: "Croxy.net", 
        url: "https://www.croxy.net/",
        format: (targetUrl) => {
            const cleanUrl = targetUrl.replace(/^https?:\/\/(www\.)?/, '');
            return `https://www.croxy.net/${cleanUrl}`;
        }
    },
    hideme: {
        name: "Hide.me",
        url: "https://hide.me/en/proxy",
        format: (targetUrl) => {
            return `https://hide.me/en/proxy?url=${encodeURIComponent(targetUrl)}`;
        }
    },
    proxyorg: {
        name: "Proxy.org", 
        url: "https://proxy.org/",
        format: (targetUrl) => {
            return `https://proxy.org/cgi-bin/proxy.cgi?url=${encodeURIComponent(targetUrl)}`;
        }
    },
    proxysite: {
        name: "ProxySite.com",
        url: "https://www.proxysite.com/",
        format: (targetUrl) => {
            return `https://www.proxysite.com/online/?title=Testing&u=${encodeURIComponent(targetUrl)}`;
        }
    },
    
    allorigins: {
        name: "AllOrigins (Working)",
        url: "https://api.allorigins.win/",
        format: (targetUrl) => {
            return `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
        }
    },
    
    corsproxy: {
        name: "CorsProxy (Alternative)",
        url: "https://corsproxy.io/",
        format: (targetUrl) => {
            return `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
        }
    },
    
    corsanywhere: {
        name: "CorsAnywhere",
        url: "https://cors-anywhere.herokuapp.com/",
        format: (targetUrl) => {
            return `https://cors-anywhere.herokuapp.com/${targetUrl}`;
        }
    }
};

// DOM elements
const proxyForm = document.getElementById('proxyForm');
const siteUrlInput = document.getElementById('siteUrl');
const proxyServiceSelect = document.getElementById('proxyService');
const proxyButton = document.getElementById('proxyButton');
const statusDiv = document.getElementById('status');
const quickButtons = document.querySelectorAll('.quick-btn');

// Update status message
function updateStatus(message, type = 'info') {
    statusDiv.textContent = message;
    statusDiv.className = 'status-box';
    if (type === 'error') {
        statusDiv.classList.add('error');
    } else if (type === 'success') {
        statusDiv.classList.add('success');
    }
}

// Validate URL format
function validateUrl(url) {
    try {
        // Add protocol if missing
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        
        new URL(url);
        return url;
    } catch (error) {
        return null;
    }
}

// Redirect to proxy
function redirectToProxy(targetUrl, serviceKey) {
    const service = proxyServices[serviceKey];
    if (!service) {
        updateStatus('Error: Invalid proxy service selected', 'error');
        return;
    }

    const validatedUrl = validateUrl(targetUrl);
    if (!validatedUrl) {
        updateStatus('Error: Please enter a valid URL (e.g., example.com or https://example.com)', 'error');
        return;
    }

    updateStatus(`Redirecting to ${service.name}...`, 'success');
    
    // Small delay to show status message
    setTimeout(() => {
        const proxyUrl = service.format(validatedUrl);
        window.location.href = proxyUrl;
    }, 500);
}

// Form submission handler
proxyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const targetUrl = siteUrlInput.value.trim();
    const serviceKey = proxyServiceSelect.value;
    
    if (!targetUrl) {
        updateStatus('Error: Please enter a URL', 'error');
        return;
    }
    
    redirectToProxy(targetUrl, serviceKey);
});

// Quick button handlers
quickButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetUrl = button.getAttribute('data-url');
        const serviceKey = button.getAttribute('data-service');
        
        siteUrlInput.value = targetUrl;
        proxyServiceSelect.value = serviceKey;
        
        redirectToProxy(targetUrl, serviceKey);
    });
});

// Example URLs for the input placeholder rotation
const exampleUrls = [
    'https://youtube.com',
    'https://chatgpt.com', 
    'https://github.com',
    'https://reddit.com',
    'https://twitter.com'
];

let currentExample = 0;

// Rotate example URLs in placeholder (optional)
function rotatePlaceholder() {
    siteUrlInput.placeholder = exampleUrls[currentExample];
    currentExample = (currentExample + 1) % exampleUrls.length;
}

// Start rotating examples every 3 seconds
setInterval(rotatePlaceholder, 3000);

// Initialize
updateStatus('Ready to access sites. Enter a URL above or use quick access buttons.');
