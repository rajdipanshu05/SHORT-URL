function copyUrl() {
    const urlInput = document.getElementById("shortUrl");
    urlInput.select();
    urlInput.setSelectionRange(0, 99999); // For mobile
    navigator.clipboard.writeText(urlInput.value);
    alert("Copied to clipboard!");
}
