function showMessage(response) {
  if (response === "No") {
    const noButton = document.getElementById("no-button");
    const container = document.querySelector(".container");
    const maxWidth = window.innerWidth - noButton.offsetWidth;
    const maxHeight = window.innerHeight - noButton.offsetHeight;

    // Set button position to absolute
    noButton.style.position = "absolute";


    // Apply new coordinates to the button
    noButton.style.left = randomX + "px";
    noButton.style.top = randomY + "px";

    // Update text content and hide name message
    document.getElementById("question").textContent =
      "The no button is just for visuals";
    document.getElementById("name").style.display = "none";
  }

  if (response === "Yes") {
    // Remove name message and no button
    document.getElementById("name").remove();
    document.getElementById("no-button").remove();

    // Update text content, show message, and change image source to "dance.gif"
    const yesMessage = document.getElementById("question");
    yesMessage.textContent = "YAYYYY -I GET MORE TIME WITH MY FAVORITE.";
    yesMessage.style.display = "block";
    yesMessage.style.fontStyle = "normal";
    document.getElementsByClassName("image")[0].src = "images/dance.gif";

    // Remove yes button
    document.getElementById("yesButton").remove();
  }
}
