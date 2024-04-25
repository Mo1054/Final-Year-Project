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

function handleSort(e) {
  urlParams.set("sort", e.value);
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
      // Process the response data
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        document
          .getElementById("profile-img")
          .setAttribute("src", reader.result);
      };
    })
    .catch((error) => {
      // Handle any errors
      console.error("Error:", error);
      alert("Error uploading profile image");
    });
}

function setCompetent(e, num) {
  //remove all the selected classes from option-1 element
  const ratingOptions = document.getElementsByClassName("option-1");
  Array.from(ratingOptions).forEach((option) =>
    option.classList.remove("selected")
  );
  // Add the selected class
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
