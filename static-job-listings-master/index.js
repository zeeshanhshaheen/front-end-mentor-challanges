const contentContainer = document.getElementById("container");
const filterBar = document.getElementById("filterbar");
const filters = document.getElementById("filters");
let filterList = [];

function getData() {
  return new Promise((resolve, reject) => {
    fetch("./data.json")
      .then((resp) => resp.json())
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
}

function checkFilter(checkList) {
  return filterList.every((element) => checkList.indexOf(element) > 0);
}

async function showContent() {
  contentContainer.innerHTML = "";
  const data = await getData();
  data.forEach((item) => {
    const itemFilters = [
      item.role,
      item.level,
      ...(item.languages || []),
      ...(item.tools || []),
    ];
    if (filterList.length === 0 || checkFilter(itemFilters)) {
      let filterContent = "";
      itemFilters.forEach((filter) => {
        filterContent += `<div class="filter" onclick="filter(this)" data-value="${filter}">${filter}</div>`;
      });

      const infoNew = item.new ? `<div class="tag bg-light">New!</div>` : "";
      const infoFeatured = item.featured
        ? `<div class="tag bg-dark">Featured</div>`
        : "";
      contentContainer.innerHTML += `
            <div class="card">
                    <img src="${item.logo}" alt="logo-${item.company}"/>
                    <div class="grid-item">
                        <div class="info">
                        <div class="info-heading">
                            <h6>${item.company}</h6>
                            ${infoNew}
                            ${infoFeatured}
                        </div>
                        <h4>${item.position}</h4>
                        <div class="info-status">
                            <div class="status">${item.postedAt} &centerdot;
                            </div>
                            <div class="status">${item.contract} &centerdot;
                            </div>
                            <div class="status">${item.location}</div>
                        </div>
                        </div>
                        <hr class="divider">
                        <div class="filters">
                        ${filterContent}
                        </div>
                    </div>
            </div>`;
    }
  });
}

function showFilterBar() {
  if (filterList.length === 0) {
    filterBar.classList.remove("show");
    filterBar.classList.add("hide");
  } else {
    filterBar.classList.remove("hide");
    filterBar.classList.add("show");
  }
  const filterBarContent = filterList.map(
    (filter) =>
      `<div class="filter-btn" data-value="${filter}" onclick="filter(this)"><p>${filter}</p><div id="clear">x</div></div>`
  );
  filters.innerHTML = "";
  filterBarContent.forEach((item) => {
    filters.innerHTML += item;
  });
  showContent();
}

function filter(element) {
  const filterValue = element.getAttribute("data-value");

  if (filterList.includes(filterValue)) {
    filterList = filterList.filter((filter) => filter !== filterValue);
    showFilterBar();
  } else {
    filterList.push(filterValue);
    showFilterBar();
  }
}

document.getElementById("clear").addEventListener("click", () => {
  filterList = [];
  showFilterBar();
});

(function () {
  showContent();
})();
