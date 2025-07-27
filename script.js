let uploadedImage = '';

function previewPhoto(event) {
  const reader = new FileReader();
  reader.onload = function () {
    uploadedImage = reader.result;
    document.getElementById('photoPreview').innerHTML =
      `<img src="${uploadedImage}" alt="Customer Photo">`;
  };
  reader.readAsDataURL(event.target.files[0]);
}

function formatDate(dateObj) {
  return dateObj.toISOString().split('T')[0];
}

function generateDueDates(startDate, frequency, count) {
  const dates = [];
  const date = new Date(startDate);

  for (let i = 0; i < count; i++) {
    const newDate = new Date(date);
    dates.push(formatDate(newDate));
    if (frequency === 'Monthly') {
      date.setMonth(date.getMonth() + 1);
    } else {
      date.setDate(date.getDate() + 7);
    }
  }

  return dates;
}

function generateBill() {
  const name = document.getElementById('name').value;
  const mobile = document.getElementById('mobile').value;
  const date = document.getElementById('date').value;
  const initial = document.getElementById('initial').value;
  const dues = parseInt(document.getElementById('dues').value);
  const frequency = document.getElementById('due').value;

  if (!name || !mobile || !date || !initial || !dues || !frequency || !uploadedImage) {
    alert("Please fill all fields and upload a photo.");
    return;
  }

  const dueDates = generateDueDates(date, frequency, dues);
  const finalDueDate = dueDates[dueDates.length - 1];

  const dueList = dueDates.map((d, i) => `<li>EMI ${i + 1}: ${d}</li>`).join('');

  const billHTML = `
    <div id="billContent" style="width: 420px; padding: 10px;">
      <h3 style="text-align:center;">Customer EMI Bill</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Mobile:</strong> ${mobile}</p>
      <p><strong>Start Date:</strong> ${date}</p>
      <p><strong>Initial Payment:</strong> ₹${initial}</p>
      <p><strong>EMI Frequency:</strong> ${frequency}</p>
      <p><strong>Total Dues:</strong> ${dues}</p>
      <p><strong>Final Due Date:</strong> ${finalDueDate}</p>
      <p><strong>Due Schedule:</strong></p>
      <ul style="padding-left: 20px;">${dueList}</ul>
      <img src="${uploadedImage}" alt="Customer Photo" style="max-width:100px; margin-top:10px;">
    </div>
  `;

  const outputDiv = document.getElementById('output');
  outputDiv.innerHTML = billHTML;
  outputDiv.style.display = 'block';
}

function downloadPDF() {
  const bill = document.getElementById('billContent');
  if (!bill) {
    alert("Please generate the bill first.");
    return;
  }

  const opt = {
    margin: 0,
    filename: 'emi-bill.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a5', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(bill).save();
}
