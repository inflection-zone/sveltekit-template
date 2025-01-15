import { formatDate } from '$lib/utils.ts/functions';

///////////////////////////////////////////////////////////////////////////////

export const careplanFilterData = async (careplanData: any) => {
	const careplanTasks_ = careplanData.reduce((groupedTasks, task) => {
		const planCode = task?.Action?.PlanCode;
		console.log('planCode', planCode);
		if (planCode) {
			if (!groupedTasks[planCode]) {
				groupedTasks[planCode] = [];
			}
			groupedTasks[planCode].push(task);
		}
		return groupedTasks;
	}, {});

	const firstPlanCode = Object.keys(careplanTasks_)[0];
	const firstPlanCodeTasks = firstPlanCode ? careplanTasks_[firstPlanCode] : [];
	const careplanTasks = firstPlanCodeTasks.sort((a, b) => {
		const freqA = a?.Action?.Frequency || 0;
		const freqB = b?.Action?.Frequency || 0;
		return freqA - freqB;
	});

	const dayWiseData = getDayWiseData(careplanTasks);
	const weekWiseData = getWeekWiseData(careplanTasks);

	const dayWiseSeparatedData = separateData(dayWiseData);
	const weekWiseSeparatedData = separateData(weekWiseData);

	const { startDate, endDate } = getStartAndEndDates(careplanTasks);

	// const careplanFilterData = {
	// 	careplanTasks,
	// 	dayWiseSeparatedData,
	// 	weekWiseSeparatedData,
	// 	startDate,
	// 	endDate
	// };

	return {
		careplanTasks,
		dayWiseSeparatedData,
		weekWiseSeparatedData,
		startDate,
		endDate
	};
;
};

function separateData(data) {
	const labels = Object.keys(data);
	const scheduled = labels.map((label) => data[label].scheduled);
	const completed = labels.map((label) => data[label].completed);
	return { labels, scheduled, completed };
}

function getStartAndEndDates(tasks) {
	if (tasks.length === 0) {
		return { startDate: null, endDate: null };
	}
	const startDate = formatDate(tasks[0].Action.ScheduledAt);
	const endDate = formatDate(tasks[tasks.length - 1].Action.ScheduledAt);
	return { startDate, endDate };
}

export function getDayWiseData(tasks: Task[]): GroupedData {
	const dayWiseData: GroupedData = {};

	tasks.forEach((task) => {
		const frequency: number | undefined = task?.Action?.Frequency;
		if (frequency !== undefined) {
			const dayKey = `Day ${frequency}`;
			if (!dayWiseData[dayKey]) {
				dayWiseData[dayKey] = { scheduled: 0, completed: 0 };
			}
			dayWiseData[dayKey].scheduled++;
			if (task.Status === 'Completed') {
				dayWiseData[dayKey].completed++;
			}
		}
	});

	return dayWiseData;
}

export function getWeekWiseData(tasks: Task[]): GroupedData {
	const weekWiseData: GroupedData = {};
	tasks.forEach((task) => {
		const frequency: number | undefined = task?.Action?.Frequency;
		if (frequency !== undefined) {
			const weekNumber: number = Math.ceil(frequency / 7);
			const weekKey = `Week ${weekNumber}`;
			if (!weekWiseData[weekKey]) {
				weekWiseData[weekKey] = { scheduled: 0, completed: 0 };
			}
			weekWiseData[weekKey].scheduled++;
			if (task.Status === 'Completed') {
				weekWiseData[weekKey].completed++;
			}
		}
	});

	return weekWiseData;
}

interface GroupedData {
	[key: number]: {
		scheduled: number;
		completed: number;
	};
}

interface Task {
	Status: string;
	Action?: Action;
}

interface Action {
	Frequency: number;
}
