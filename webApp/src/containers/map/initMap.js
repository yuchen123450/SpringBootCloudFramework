import eventProxy from '../../utils/eventProxy';

const defaultOptions = {
    zoom: 2,
    center: [0, 0],
};

class InitMapControl {
    constructor(options) {
        this.options = Object.assign({}, defaultOptions, options);
        this._container = document.body.querySelector('.mapboxgl-ctrl-group');
        if (this._container === null) {
            this._container = document.createElement('div');
            this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
        }
    }

    onAdd(map) {
        this._map = map;
        this._initBtn = this._createButton(
            'mapboxgl-ctrl-icon mapboxgl-ctrl-init-map',
            'Init Map',
            () => {
                eventProxy.trigger('companyHover', '');
                this._map.easeTo({
                    center: this.options.center,
                    zoom: this.options.zoom,
                });
            }
        );
        this._container.appendChild(this._initBtn);
        return this._container;
    }

    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }

    _createButton(className, ariaLabel, fn) {
        let a = document.createElement('button');
        a.className = className;
        a.title = ariaLabel;
        a.appendChild(document.createElement('span'));
        a.setAttribute('aria-label', ariaLabel);
        a.addEventListener('click', fn);
        return a;
    }
}

export default InitMapControl;
