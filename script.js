let api = `https://api.github.com/search/repositories?q=Q`;

const searchInput = document.querySelector(".search");
const searchOptions = document.querySelector(".options");
const searchContainer = document.querySelector(".container");

const debounce = (fn, delay) => {
  let timeout;
  return function() {
    clearTimeout(timeout);
    let func = () => {
      fn.apply(this, arguments);
    };
    timeout = setTimeout(func, delay);
  };
};

async function getRepositories() {
  const url = new URL("https://api.github.com/search/repositories");
  url.searchParams.append("q", searchInput.value);
  try {
    if (searchInput.value != "") {
      let response = await fetch(url);
      if (response.ok) {
        let repositories = await response.json();

        showRepositories(repositories);
      }
    } else {
      clearRepos();
    }
  } catch (err) {
    return err;
  }
}

const clearRepos = () => {
  searchContainer.innerHTML = "";
};

const clearSearch = () => {
  searchInput.value = "";
};

function showRepositories(repo) {
  clearRepos();
  for (let i = 0; i < 5; i++) {
    const currRepo = repo.items[i];
    let repoName = currRepo.name;
    let userName = currRepo.owner.login;
    let stars = currRepo.stargazers_count;
    let htmlSearch = `<li class="containerList" data-repo=${repoName} data-owner=${userName} data-stars=${stars}>${repoName}/${userName}</li>`;
    searchContainer.innerHTML += htmlSearch;
  }
}

searchContainer.addEventListener("click", addReposetories);

function addReposetories(event) {
  clearRepos();
  clearSearch();
  const currentEl = event.target;
  let htmlOptions = `<li class="card">
<span class="nameRepo">${currentEl.dataset.repo}</span>
<span class="name">${currentEl.dataset.owner}</span>
<span class="stars">&#9734 ${currentEl.dataset.stars}</span>
<span class="close"></span>
</li>`;
  searchOptions.innerHTML += htmlOptions;
}

searchInput.addEventListener("input", debounce(getRepositories, 500));

function deliteItem(event) {
  clearRepos();
  const currentLi = event.target.offsetParent;
  if (event.target.classList.contains("close")) {
    searchOptions.removeChild(currentLi);
  }
}

searchOptions.addEventListener("click", deliteItem);
