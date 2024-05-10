const explore_sort = document.getElementById("explore_sort");
const urlParams = new URLSearchParams(window.location.search);
const paramValue = urlParams.get("sort");
if (explore_sort) {
  switch (paramValue) {
    case "all":
      explore_sort.selectedIndex = 0;
      break;
    case "featured":
      explore_sort.selectedIndex = 1;
      break;
    case "suggested":
      explore_sort.selectedIndex = 2;
      break;
    default:
      explore_sort.selectedIndex = 0;
  }
}

if (urlParams.get("country")) {
  const country = urlParams.get("country");
  document.getElementById("countries_list").selectedIndex =
    parseInt(country) + 1;
}

function handleSort(e) {
  urlParams.set("sort", e.value);
  window.location.search = urlParams.toString();
}

function setCat(id) {
  urlParams.set("cat", id);
  window.location.search = urlParams.toString();
}

function setCountry(e) {
  if (e.value === "all") {
    urlParams.delete("country");
  } else {
    urlParams.set("country", e.value);
  }
  window.location.search = urlParams.toString();
}

function triggerImage(e) {
  const profileInput = document.getElementById("profile-img-input");
  profileInput.click();
}

function uploadProfile(e) {
  const file = e.files[0];
  const fd = new FormData();
  fd.append("file", file);
  fetch("/uploadProfile", {
    method: "POST",
    body: fd,
  })
    .then((response) => response.json())
    .then((data) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        document
          .getElementById("profile-img")
          .setAttribute("src", reader.result);
      };
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error uploading profile image");
    });
}

function setCompetent(e, num) {
  const ratingOptions = document.getElementsByClassName("option-1");
  Array.from(ratingOptions).forEach((option) =>
    option.classList.remove("selected")
  );
  e.classList.add("selected");

  const competent_rating = document.getElementById("competent_rating");
  competent_rating.value = num;
}

function setLikable(e, num) {
  const ratingOptions = document.getElementsByClassName("option-2");
  Array.from(ratingOptions).forEach((option) =>
    option.classList.remove("selected")
  );
  e.classList.add("selected");
  const likable_rating = document.getElementById("likable_rating");
  likable_rating.value = num;
}

function setInfluential(e, num) {
  const ratingOptions = document.getElementsByClassName("option-3");
  Array.from(ratingOptions).forEach((option) =>
    option.classList.remove("selected")
  );
  e.classList.add("selected");
  const influential_rating = document.getElementById("influential_rating");
  influential_rating.value = num;
}
