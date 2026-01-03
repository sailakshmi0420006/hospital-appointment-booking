// ================== HOSPITAL DATA ==================
let map;
let marker;

const hospitals = {
  "SVIMS Hospital": { lat: 13.6288, lng: 79.4192 },
  "Apollo Hospital": { lat: 13.6350, lng: 79.4100 },
  "King George Hospital": { lat: 13.6310, lng: 79.4250 },
  "Srikara Hospital": { lat: 13.6205, lng: 79.4220 },
  "Ruiya Hospital": { lat: 13.6260, lng: 79.4150 }
};

// ================== TEMP SLOT STORAGE ==================
let bookedSlots = [];

// ================== LOGIN ==================
function login() {
  const loginName = document.getElementById("loginName").value;
  const loginEmail = document.getElementById("loginEmail").value;

  if (!loginName || !loginEmail) {
    alert("Please enter login details");
    return;
  }

  document.getElementById("name").value = loginName;
  document.getElementById("email").value = loginEmail;

  document.getElementById("loginPage").style.display = "none";
  document.getElementById("appointmentPage").style.display = "block";
}

// ================== DOCTORS ==================
function updateDoctors() {
  const dept = document.getElementById("department").value;
  const doctor = document.getElementById("doctor");

  doctor.innerHTML = "<option value=''>Select Doctor</option>";

  const doctors = {
    Cardiology: ["Dr. Ramesh", "Dr. Suresh"],
    Orthopedics: ["Dr. Anil", "Dr. Kiran"],
    Neurology: ["Dr. Meena", "Dr. Ravi"],
    Dermatology: ["Dr. Sunita", "Dr. Raj"]
  };

  doctors[dept]?.forEach(d => {
    let opt = document.createElement("option");
    opt.value = d;
    opt.text = d;
    doctor.add(opt);
  });
}

// ================== AVAILABILITY CHECK ==================
function checkAvailability(doctor, date, time) {
  const selectedTime = new Date(`${date}T${time}`);

  return bookedSlots.some(slot => {
    if (slot.doctor !== doctor || slot.date !== date) return false;

    const bookedTime = new Date(`${slot.date}T${slot.time}`);
    const diffMinutes = Math.abs(selectedTime - bookedTime) / (1000 * 60);

    return diffMinutes < 30; // 30 minutes slot
  });
}

// ================== CONFIRM APPOINTMENT + FETCH ==================
function confirmAppointment() {
  const data = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    hospital: document.getElementById("hospital").value,
    doctor: document.getElementById("doctor").value,
    date: document.getElementById("date").value,
    time: document.getElementById("time").value,
    payment: document.getElementById("payment").value,
    rating: document.getElementById("rating").value,
    review: document.getElementById("review").value
  };

  if (!data.name || !data.doctor || !data.date || !data.time || !data.hospital) {
    alert("Please fill all required fields");
    return;
  }

  if (checkAvailability(data.doctor, data.date, data.time)) {
    alert("⛔ This time slot is already booked. Please choose another time.");
    return;
  }

  bookedSlots.push({
    doctor: data.doctor,
    date: data.date,
    time: data.time
  });

  // 🔴 IMPORTANT: Replace URL below
  fetch("https://script.google.com/macros/s/AKfycbzpHbUva9nNEwmk79YOCzDXkdr8dMJqihTlsf5QVMCeA3uftXg8XyHo_C1jtAGoHnj8EQ/exec", {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify(data)
  })
  .then(() => {

    document.getElementById("confMsg").innerHTML = `
      <b>Appointment Confirmed</b><br><br>
      <b>Patient:</b> ${data.name}<br>
      <b>Email:</b> ${data.email}<br>
      <b>Hospital:</b> ${data.hospital}<br>
      <b>Doctor:</b> ${data.doctor}<br>
      <b>Date:</b> ${data.date}<br>
      <b>Time:</b> ${data.time}<br>
      <b>Payment:</b> ${data.payment}<br>
      <b>Rating:</b> ${data.rating}<br>
      <b>Review:</b> ${data.review}
    `;

    document.getElementById("appointmentPage").style.display = "none";
    document.getElementById("confirmation").style.display = "block";
  
  })
  .catch(() => {
    alert("❌ Failed to save appointment");
  });
}

// ================== GOOGLE MAP ==================
function initMap() {
  const defaultLocation = hospitals["SVIMS Hospital"];

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14,
    center: defaultLocation
  });

  marker = new google.maps.Marker({
    position: defaultLocation,
    map: map,
    title: "Hospital Location"
  });
}

function changeHospital() {
  const selectedHospital = document.getElementById("hospital").value;
  if (!selectedHospital) return;

  const location = hospitals[selectedHospital];
  map.setCenter(location);
  marker.setPosition(location);
  marker.setTitle(selectedHospital);
}