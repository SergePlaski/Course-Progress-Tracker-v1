function convertToMin(hm) {
	return hm.split(":").reduce((a, b) => +a * 60 + +b, 0);
}

function convertToHrsMin(m) {
	const hrs = Math.floor(m / 60);
	const mins = m - hrs * 60;
	return hrs.toString() + ":" + ("0" + mins.toString()).slice(-2);
}

function getTotalDuration(arr) {
	return arr.reduce((a, b) => a + b, 0);
}

function renderChart(chartId, labelId, completedPct) {
	const ctx = document.getElementById(chartId);
	const label = document.getElementById(labelId);
	const chart = new Chart(ctx, {
		type: "doughnut",
		data: {
			// labels: ['OK', 'WARNING', 'CRITICAL', 'UNKNOWN'],
			labels: [],
			datasets: [
				{
					label: "",
					data: [completedPct, 100 - completedPct],
					backgroundColor: [
						// 'rgba(255, 99, 132, 0.5)',
						// 'rgba(54, 162, 235, 0.2)',
						// 'rgba(255, 206, 86, 0.2)',
						// 'rgba(75, 192, 192, 0.2)'
						"rgb(24, 71, 109)",
						"rgba(24, 71, 109, 0.3)",
					],
					borderColor: [
						// 'rgba(255,99,132,1)',
						// 'rgba(54, 162, 235, 1)',
						// 'rgba(255, 206, 86, 1)',
						// 'rgba(75, 192, 192, 1)'
					],
					borderWidth: 1,
				},
			],
		},
		options: {
			cutoutPercentage: 70,
			responsive: false,
		},
	});

	chart.resize(); // Resize the chart to config settings
	label.textContent = completedPct + "%";
	// console.log(chart);
}

function renderModulesData(id) {
	let el = document.getElementById(id);
	modules.forEach((module, index) => {
		const m = module.title.split(" - ");
		el.innerHTML += `<div class='module ${
			module.duration === "0:00" ? "optional" : ""
		}' key=${index + 1} id='m${index + 1}'>
<p class='module__number'>${m[0]}</p>
<p class='module__title'>${m[1]}</p>
<p class='module__duration'>${module.duration}</p></div>`;
	});

	// return NodeList of module elements
	return document.querySelectorAll(".module");
}

// calculate course progress
function updateProgressStats(completedModuleIndex = 0) {
	console.log("completed " + completedModuleIndex);

	// calculate total time
	const allModulesDurations = modules.map((module) =>
		convertToMin(module.duration)
	);
	const totalDuration = getTotalDuration(allModulesDurations);
	// initial values
	let completedDuration = 0;
	let completedPct = 0;

	if (completedModuleIndex > 0) {
		// some modules have been completed - calculate completed time/pct
		const completedModulesDurations = allModulesDurations.slice(
			0,
			completedModuleIndex
		);
		completedDuration = getTotalDuration(completedModulesDurations);
		completedPct = Math.round(
			(getTotalDuration(completedModulesDurations) * 100) /
				getTotalDuration(allModulesDurations)
		);

		// highlight all completed modules
		moduleNodes.forEach((moduleNode) => {
			if (+moduleNode.getAttribute("key") <= completedModuleIndex) {
				moduleNode.classList.add("selected");
			} else {
				moduleNode.classList.remove("selected");
			}
		});
	}

	// reflect completed stats on the UI and chart
	document.getElementById("total").textContent = convertToHrsMin(totalDuration);
	document.getElementById("compl").textContent =
		convertToHrsMin(completedDuration);
	renderChart("myChart", "myProgress", completedPct);
}

function clearCurrentSelection() {
	moduleNodes.forEach((module) => module.classList.remove("selected"));
}

// ***********  initialize the app **************
const moduleNodes = renderModulesData("modules");
// check for stored selection and update the progress stats
const selectedModuleIndex = localStorage.getItem("selectedModuleIndex");

updateProgressStats(+selectedModuleIndex);

// wire up modules for click event
// use a single event listener with event delegation:
// e.target is always the actual element clicked,
// even though the event is bubbled and captured by the parent container
document.getElementById("modules").addEventListener("click", (e) => {
	try {
		const selected_module = e.target.closest(".module");
		if (selected_module) {
			const selectedModuleIndex = +selected_module.getAttribute("key");
			// if the selected module is the last selected already, do not re-render
			const isHighestSelected =
				selected_module.classList.contains("selected") &&
				selectedModuleIndex < modules.length + 1 &&
				!document
					.getElementById("m" + (selectedModuleIndex + 1))
					.classList.contains("selected");
			if (isHighestSelected) {
				return;
			}
			// store the selection
			localStorage.setItem("selectedModuleIndex", selectedModuleIndex);
			// update progress stats
			updateProgressStats(selectedModuleIndex);
		} else {
			throw new Error("No module selected");
		}
	} catch (err) {
		console.error(err);
	}
});
