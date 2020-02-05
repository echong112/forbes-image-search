import './image-browser.scss';

export default class ImageBrowser {
  constructor(config) {
    this.config = config;
    this.images = [];
    this.page = 1;
    this.searchTerm = 'cookies';
    this.setup();
  }

  setup() {
    this.fetchApi(this.searchTerm, this.page)
      .then(images => this.images = images)
      .then(() => this.render())
      .catch(e => this.errors = e);
  }

  render() {
    const imageBrowser = this.config.element;
    imageBrowser.innerHTML = '';
    imageBrowser.classList.add('image-browser');

    const textInput = document.createElement('input');
    textInput.placeholder = 'Enter a search term';
    textInput.onchange = e => this.searchTerm = e.target.value;

    imageBrowser.append(textInput);
    imageBrowser.append(this.createSubmit());
    imageBrowser.append(this.createImageGrid(this.images));
    imageBrowser.append(this.createButton('Prev', -1));
    imageBrowser.append(this.createButton('Next', 1));
  }

  fetchApi(q, p) {
    return new Promise((resolve, reject) => {
      const apiHost = 'https://pixabay.com/api/';
      // typically would be in .env, but for simplicity
      const key = `key=${'15144804-6e25475c6f9c386e189b93e63'}`;
      const type = `image_type=photo`;
      const query = `q=${q.split(' ').join('+')}`;
      const perPage = `per_page=${12}`
      const page = p ? `page=${p}` : '';

      const url = `${apiHost}?${key}&${query}&${type}&${page}&${perPage}`;

      fetch(url)
        .then(res => res.json())
        .then(data => resolve(data.hits))
        .catch(e => reject(e))
    });
  }

  createButton(label, increment) {
    let button = document.createElement('button');
    button.innerHTML = label;
    button.onclick = e => {
      this.page += increment;
      this.page = this.page < 1 ? 1 : this.page;
      this.setup();
    }
    return button;
  }

  createImageGrid(images) {
    let imageGrid = document.createElement('ul');
    imageGrid.classList.add('image-grid');
    images.map(image => {
      let listItem = document.createElement('li');
      listItem.classList.add('image-grid__item')
      listItem.style = `background: url(${image.previewURL}); background-size: cover`;
      imageGrid.append(listItem);
    });
    return imageGrid;
  }

  createTextInput() {
    const textInput = document.createElement('input');
    textInput.placeholder = 'Enter a search term';
    textInput.onchange = e => this.searchTerm = e.target.value;
  }
  
  createSubmit() {
    const submit = document.createElement('button');
    submit.innerHTML = 'Submit';
    submit.onclick = () => this.setup();
    return submit;
  }
}
