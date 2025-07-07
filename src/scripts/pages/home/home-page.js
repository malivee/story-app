import HomePresenter from "./home-presenter.js";
import Api from "../../data/api.js";
import formatDateTimeToIndo from "../../utils/date-helper.js";
import database from "../../data/database.js";

export default class HomePage {
  #presenter;

  async render() {
    return `
      <div class="story-button">
        <div style="font-size: 24px;">👤</div>
        <button id="button-story">Buat Story Anda</button>
      </div>

      <section class="story-grid" id="story-grid"></section>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({
      model: new Api(),
      view: this,
    });
    this.#presenter.init();

    document.getElementById("button-story").addEventListener("click", () => {
      window.location.hash = "/create";
      window.location.reload();
    });

    await this.renderCards();
  }

  async renderCards() {
    const storyGrid = document.querySelector(".story-grid");
    if (!storyGrid) return;

    try {
      const api = new Api();
      const { listStory } = await api.getData();

      const lovedStories = await database.getData();
      const lovedStoryIds = new Set(lovedStories.map((s) => s.id));

      listStory.forEach((story) => {
        const isLoved = lovedStoryIds.has(story.id);

        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.innerHTML = `
          <img src="${story.photoUrl}" alt="Story image">
          <div class="card-content">
            <h1>${story.name}</h1>
            <p>${story.description}</p>
            <p>${formatDateTimeToIndo(story.createdAt)}</p>
            <button class="love-button" aria-label="Love this story">
              ${isLoved ? "🖤" : "🤍"}
            </button>
          </div>
        `;

        const loveButton = cardElement.querySelector(".love-button");
        loveButton.addEventListener("click", async () => {
          const currentlyLoved = await database.isLoved(story.id);

          if (currentlyLoved) {
            await database.unlove(story.id);
            loveButton.innerHTML = "🤍";
          } else {
            await database.love({ ...story, isLoved: true });
            loveButton.innerHTML = "🖤";
          }
        });

        storyGrid.appendChild(cardElement);
      });
    } catch (error) {
      console.error("Failed to fetch stories:", error);
      storyGrid.innerHTML = `<p>Gagal fetch story.</p>`;
    }
  }
}
