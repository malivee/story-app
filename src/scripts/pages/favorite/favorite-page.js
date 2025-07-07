import FavoritePresenter from "./favorite-presenter.js";
import formatDateTimeToIndo from "../../utils/date-helper.js";
import database from "../../data/database.js";

export default class FavoritePage {
  #presenter;

  async render() {
    return `
      <div class="favorite-page">
        <section class="story-grid" id="story-grid"></section>
      </div>
    `;
  }

  async afterRender() {
    this.#presenter = new FavoritePresenter({
      model: database,
      view: this,
    });

    await this.#presenter.init();
  }

  async renderCards(listStory) {
    const storyGrid = document.querySelector("#story-grid");
    storyGrid.innerHTML = "";

    listStory.forEach((story) => {
      const cardElement = document.createElement("div");
      cardElement.classList.add("card");

      cardElement.innerHTML = `
        <img src="${story.photoUrl}" alt="Story image">
        <div class="card-content">
          <h1>${story.name}</h1>
          <p>${story.description}</p>
          <p>${formatDateTimeToIndo(story.createdAt)}</p>
          <button class="love-button" aria-label="Unlove this story">🖤</button>
        </div>
      `;

      const loveButton = cardElement.querySelector(".love-button");

      loveButton.addEventListener("click", async () => {
        await database.unlove(story.id);
        cardElement.remove();
        if (!document.querySelectorAll(".card").length) {
          this.renderEmpty();
        }
      });

      storyGrid.appendChild(cardElement);
    });
  }

  renderEmpty() {
    const storyGrid = document.querySelector("#story-grid");
    storyGrid.innerHTML = `<h1>Belum ada story yang kamu sukai 💔</h1>`;
  }

  renderError(message) {
    const storyGrid = document.querySelector("#story-grid");
    storyGrid.innerHTML = `<p>Terjadi kesalahan: ${message}</p>`;
  }
}
