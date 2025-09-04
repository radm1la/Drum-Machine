// =============================
// 🎵 Drum Machine Script
// =============================

const keys = document.querySelectorAll(".drum-pad");
const display = document.getElementById("display");

// =============================
// 🔊 Play Sounds (Click Support)
// =============================
keys.forEach((key) => {
  key.addEventListener("click", () => {
    const audio = key.querySelector("audio"); 
    audio.play(); 
    displaySoundName(key.innerText); 
  });
});

// =============================
// 🔊 Play Sounds (Keyboard Support)
// =============================

// Play a sound by key (Q, W, E, A, S, D, Z, X, C)
function playSound(key) {
  const audio = document.getElementById(key.toUpperCase());
  if (audio) audio.play();
}

// Update display text based on which key was pressed
function displaySoundName(name) {
  switch (name.toUpperCase()) {
    case "Q":
      display.innerText = "Heater-1";
      break;
    case "W":
      display.innerText = "Heater-2";
      break;
    case "E":
      display.innerText = "Heater-3";
      break;
    case "A":
      display.innerText = "Heater-4";
      break;
    case "S":
      display.innerText = "Clap";
      break;
    case "D":
      display.innerText = "Open-HH";
      break;
    case "Z":
      display.innerText = "Kick-n'-Hat";
      break;
    case "X":
      display.innerText = "Kick";
      break;
    case "C":
      display.innerText = "Closed-HH";
      break;
    default:
      break;
  }
}

// Handle keyboard key presses
document.addEventListener("keydown", (e) => {
  playSound(e.key);          
  displaySoundName(e.key);   

  const key = e.key.toUpperCase();
  // Find matching pad by its inner text
  const pad = [...keys].find((p) => p.textContent.trim() === key);
  if (!pad) return;

  // Add visual "active" effect for a short time
  pad.classList.add("active");
  setTimeout(() => pad.classList.remove("active"), 150);
});

// =============================
// ⏺️ Recording Logic
// =============================

const recordButton = document.querySelector("#record img");
const playButton = document.querySelector("#play img");
const clearButton = document.querySelector("#clear img");

let recording = [];    // stores { key, time }
let isRecording = false;

recordButton.addEventListener("click", () => {
  startRecording();
});

playButton.addEventListener("click", () => {
  playRecording();
});

clearButton.addEventListener("click", () => {
  clearRecording();
});

// Record clicks on pads
keys.forEach((key) => {
  key.addEventListener("click", () => {
    if (isRecording) {
      recording.push({ key: key.innerText, time: Date.now() });
    }
  });
});

// Record keyboard presses
document.addEventListener("keydown", (e) => {
  if (isRecording && /^[qweasdzxc]$/i.test(e.key)) {
    recording.push({ key: e.key, time: Date.now() });
  }
});

function stopRecording() {
  isRecording = false;
  recordButton.src =
    "https://img.icons8.com/?size=100&id=85775&format=png&color=ffffff";
  display.innerText = "Recording Stopped";
}

// Start a new recording
function startRecording() {
  recordButton.src =
    "https://img.icons8.com/?size=100&id=85775&format=png&color=ff4c4c";
  display.innerText = "Recording Started";

  if (!isRecording) {
    isRecording = true;
    recording = []; // reset previous recording
  }
}

// Play back the recording with correct timing
function playRecording() {
  // If no recording exists, show message and flash button
  if (recording.length === 0) {
    recordButton.src =
      "https://img.icons8.com/?size=100&id=85775&format=png&color=ffffff";
    playButton.src =
      "https://img.icons8.com/?size=100&id=59862&format=png&color=ff4c4c";
    setTimeout(() => {
      playButton.src =
        "https://img.icons8.com/?size=100&id=59862&format=png&color=ffffff";
    }, 150);
    display.innerText = "No Recording Available";
    return;
  }

  // Stop recording if still active
  if (isRecording) {
    stopRecording();
  }

  display.innerText = "Playing Recording";

  playButton.src =
    "https://img.icons8.com/?size=100&id=59862&format=png&color=ff4c4c";

  let delay = 0; // total accumulated delay
  recording.forEach(({ key, time }, index) => {
    // Calculate time gap between current note and previous one
    delay += index === 0 ? 0 : time - recording[index - 1].time;

    // Schedule this note to play at the correct time
    setTimeout(() => {
      playSound(key);

      // Visual feedback: highlight the pad briefly
      const pad = [...keys].find(
        (p) => p.textContent.trim() === key.toUpperCase()
      );
      if (pad) {
        pad.classList.add("active");
        setTimeout(() => pad.classList.remove("active"), 150);
      }
    }, delay);
  });

  // Reset play button after playback finishes
  const totalDuration =
    recording.length > 0
      ? recording[recording.length - 1].time - recording[0].time
      : 0;

  setTimeout(() => {
    playButton.src =
      "https://img.icons8.com/?size=100&id=59862&format=png&color=ffffff";
    display.innerText = "Recording Finished";
  }, totalDuration + 100); // small buffer for last note
}

// Clear the current recording
function clearRecording() {
  if (isRecording) {
    stopRecording();
  }
  clearButton.src =
    "https://img.icons8.com/?size=100&id=99950&format=png&color=ff4c4c";
  setTimeout(() => {
    clearButton.src =
      "https://img.icons8.com/?size=100&id=99950&format=png&color=ffffff";
  }, 150);

  if (recording.length === 0) {
    display.innerText = "No Recording to Clear";
    return;
  }

  recording = []; // reset array
  display.innerText = "Recording Cleared";
}

// =============================
// ❓ Help Menu
// =============================

const drumMachine = document.getElementById("drum-machine");
const helperIcon = document.getElementById("helper-icon");

helperIcon.addEventListener("click", (e) => {
  e.stopPropagation(); // prevent click from bubbling

  let helperBox = document.getElementById("helper-text");

  if (helperBox) {
    // Toggle visibility if help box already exists
    helperBox.style.display =
      helperBox.style.display === "none" ? "block" : "none";
  } else {
    // Create help box 
    helperBox = document.createElement("div");
    helperBox.id = "helper-text";
    helperBox.innerHTML = `
      <h2>How to use the Drum Machine:</h2>
      <ul>
        <li>Click on the drum pads or press the keys (Q, W, E, A, S, D, Z, X, C) to play sounds.</li>
        <li>Click the <span class="red">record button</span> to start recording. Use Play or Clear to stop.</li>
        <li>Click the play button to listen to your recording.</li>
        <li>Click the clear button to delete your recording.</li>
        <li>The display shows the sound being played and recording status.</li>
        <li>Enjoy making beats! <em>(Click outside this box to close)</em></li>
      </ul>
    `;
    drumMachine.appendChild(helperBox);
  }
});

// Close help box when clicking anywhere outside it
document.addEventListener("click", () => {
  const helperBox = document.getElementById("helper-text");
  if (helperBox) {
    helperBox.style.display = "none";
  }
});
