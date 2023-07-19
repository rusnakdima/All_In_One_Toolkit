class Router {
  constructor() {
    this.routes = [];
  }

  addRoute(path, file) {
    this.routes.push({ path, file });
  }

  loadRoute(route, containerId) {
    fetch(route.file)
      .then(response => response.text())
      .then(html => {
        const container = document.getElementById(containerId);
        container.innerHTML = html;
        const scriptUrl = (route.path.split('/').slice(1) != '') ? route.path.split('/').slice(1) + '/script.js' : 'home/script.js';
        return fetch(scriptUrl);
      })
      .then(response => response.text())
      .then(script => {
        if (script) {
          eval(script);
        }
      });
  }

  init(containerId) {
    window.addEventListener('hashchange', () => {
      const url = location.hash.slice(1);
      const route = this.routes.find(route => route.path === url);
      if (route) {
        this.loadRoute(route, containerId)
      } else {
        // Если URL-адрес не соответствует ни одному маршруту, перенаправьте на домашнюю страницу.
        const homeRoute = this.routes.find(route => route.path === '/');
        this.loadRoute(homeRoute, containerId);
      }
    });

    window.dispatchEvent(new Event('hashchange'));
  }
}