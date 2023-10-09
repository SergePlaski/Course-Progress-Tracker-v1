const modules = [
	{ title: "01 - Getting Started", duration: "0:41" },
	{ title: "02 - JavaScript Refresher", duration: "0:00" },
	{ title: "03 - React Basics & Working With Components", duration: "2:16" },
	{ title: "04 - Time to Practice Component Basics", duration: "0:26" },
	{ title: "05 - React State & Working with Events", duration: "1:59" },
	{ title: "06 - Rendering Lists & Conditional Content", duration: "1:01" },
	{ title: "07 - Styling React Components", duration: "0:54" },
	{ title: "08 - Debugging React Apps", duration: "0:27" },
	{
		title: "09 - Time to Practice A Complete Practice Project",
		duration: "2:13",
	},
	{
		title: "10 - Diving Deeper Working with Fragments, Portals & Refs",
		duration: "0:48",
	},
	{
		title:
			"11 - Advanced Handling Side Effects, Using Reducers & Using the Context API",
		duration: "2:24",
	},
	{
		title: "12 - Practice Project Building a Food Order App",
		duration: "2:19",
	},
	{
		title: "13 - A Look Behind The Scenes Of React & Optimization Techniques",
		duration: "1:16",
	},
	{
		title:
			"14 - An Alternative Way Of Building Components Class-based Components",
		duration: "1:00",
	},
	{
		title: "15 - Sending Http Requests (e.g. Connecting to a Database)",
		duration: "1:02",
	},
	{ title: "16 - Building Custom React Hooks", duration: "1:02" },
	{ title: "17 - Working with Forms & User Input", duration: "1:33" },
	{
		title: "18 - Practice Project Adding Http & Forms To The Food Order App",
		duration: "1:14",
	},
	{
		title: "19 - Diving into Redux (An Alternative To The Context API)",
		duration: "2:15",
	},
	{ title: "20 - Advanced Redux", duration: "1:54" },
	{
		title: "21 - Building a Multi-Page SPA with React Router",
		duration: "3:45",
	},
	{ title: "22 - Adding Authentication To React Apps", duration: "1:13" },
	{ title: "23 - Deploying React Apps", duration: "0:33" },
	{
		title: "24 - React Query / Tanstack Query: Handling HTTP Requests",
		duration: "2:54",
	},
	{
		title: "25 - A (Pretty Deep Dive) Introduction to Next.js",
		duration: "3:16",
	},
	{ title: "26 - Animating React Apps", duration: "3:05" },
	{ title: "27 - Replacing Redux with React Hooks", duration: "0:56" },
	{ title: "28 - Testing React Apps (Unit Tests)", duration: "1:12" },
	{ title: "29 - React + TypeScript", duration: "2:35" },
	{
		title: "30 - Optional React Hooks Introduction & Summary",
		duration: "3:03",
	},
	{
		title: "31 - Optional React Summary & Core Feature Walkthrough",
		duration: "0:00",
	},
	{ title: "32 - Course Roundup", duration: "0:10" },
];

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
	new Chart(ctx, {
		type: "doughnut",
		data: {
			// labels: ['OK', 'WARNING', 'CRITICAL', 'UNKNOWN'],
			labels: [],
			datasets: [
				{
					label: "my progress",
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

	label.textContent = completedPct + "%";
}

function renderModulesData(id) {
	let el = document.getElementById(id);
	modules.forEach((module, index) => {
		const m = module.title.split(" - ");
		el.innerHTML += `<div class='module ${
			module.duration === "0:00" ? "optional" : ""
		}' key=${index+1}>
<p class='module__number'>${m[0]}</p>
<p class='module__title'>${m[1]}</p>
<p class='module__duration'>${module.duration}</p></div>`;
	});

	// return NodeList of module elements
	return document.querySelectorAll(".module");
}

// calculate course progress
function updateProgressStats(completedModuleIndex = 0) {
	console.log('completed ' + completedModuleIndex);

	// calculate tital time
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
moduleNodes.forEach((el) => {
	el.addEventListener("click", (e) => {
		try {
			const selected_module = e.target.closest(".module");
			if (selected_module) {
				const selectedModuleIndex = +selected_module.getAttribute("key");
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
});
