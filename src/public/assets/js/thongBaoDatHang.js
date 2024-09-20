// Hàm hiển thị thông báo tùy chỉnh
function showCustomAlert(message) {
  const alertElement = document.getElementById("custom-alert");
  const messageElement = document.getElementById("alert-message");

  // Hiển thị thông báo và đặt nội dung
  alertElement.style.display = "block";
  messageElement.innerText = message;

  // Ẩn thông báo sau một khoảng thời gian (ví dụ: 5 giây)
  setTimeout(() => {
    hideCustomAlert();
    window.location.href = "/detailt-cart-trang-moi";
  }, 2000);
}

// Hàm ẩn thông báo tùy chỉnh
function hideCustomAlert() {
  const alertElement = document.getElementById("custom-alert");

  // Ẩn thông báo
  alertElement.style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("dathang");
  const errorElement = document.getElementById("error-message");


  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting in the traditional way

    // Assuming you are using FormData to serialize the form data
    const formData = new FormData(form);

    // Make an AJAX request
    fetch("/dat-hang", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
          if (data.success) {
              showCustomAlert(data.message);
          } else {
              if (data.error) {
                  errorElement.textContent = data.error; // Hiển thị thông báo lỗi từ máy chủ
              } else if (data.message) {
                  errorElement.textContent = data.message; // Hiển thị thông báo từ máy chủ
              } else {
                  errorElement.textContent = 'Có vẻ có một số sản phẩm đã hết hàng. Vui lòng kiểm tra lại giỏ hàng của bạn.'; 
              }
          }
      })
      .catch((error) => {
          console.error("Error in dat-hang:", error);
          errorElement.textContent = "Có lỗi xảy ra khi đặt hàng.";
      });
  });
});
