import { formatDateMonth } from "$lib/utils.ts/functions";

// ////////////////////////////////////////////////////////////////////////////

export const vitalsFilterData = (resultData: any) => {
	const heightData = resultData?.BodyHeight ?? [];
	const weightData = resultData?.BodyWeight ?? [];
	const temperatureData = resultData?.BodyTemperature ?? [];
	const glucoseData = resultData?.BloodGlucose ?? [];
	const oxygenSaturationData = resultData?.BloodOxygenSaturation ?? [];
	const pressureData = resultData?.BloodPressure ?? [];
	const pulseRateData = resultData?.Pulse ?? [];

	const vitalsData = {
		height: handleVitals(formatData(heightData, 'BodyHeight'), 'Height'),
		weight: handleVitals(formatData(weightData, 'BodyWeight'), 'Weight'),
		bloodPressure: handleVitals(
			formatBloodPressureData(pressureData, 'Systolic', 'Diastolic'),
			'Blood Pressure'
		),
		glucose: handleVitals(formatData(glucoseData, 'BloodGlucose'), 'Glucose'),
		oxygenSaturation: handleVitals(
			formatData(oxygenSaturationData, 'BloodOxygenSaturation'),
			'Oxygen Saturation'
		),
		temperature: handleVitals(formatData(temperatureData, 'BodyTemperature'), 'Temperature'),
		pulse: handleVitals(formatData(pulseRateData, 'Pulse'), 'Pulse')
	};

	return vitalsData;
};

export function formatData(data: any, valueKey: any) {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return []; 
    }
    
    return data.map((item: any) => ({
      value: item[valueKey] || null, 
      date: formatDateMonth(item.RecordDate) || 'Unknown Date', 
      unit: item.Unit || '' // 
    }));
  }
  
  export function formatBloodPressureData(data: any, valueKey1: any, valueKey2: any) {
    return data.map((item:any) => ({
      value: item[valueKey1],
      value1: item[valueKey2],
      date: formatDateMonth(item.RecordDate),
      unit: item.Unit
    }));
  }
  
  export function handleVitals(vitalData: any[], vitalType: string) {
    if (!vitalData || vitalData.length === 0) {
      return [];
    }
    const groupedData: Record<string, any[]> = {};
    vitalData.forEach((record) => {
      if (!groupedData[record.date]) {
        groupedData[record.date] = [];
      }
      groupedData[record.date].push(record);
    });
    const sampledData: Record<string, any> = {};
    Object.keys(groupedData).forEach((date) => {
      const records = groupedData[date];
      const randomIndex = Math.floor(Math.random() * records.length);
      sampledData[date] = records[randomIndex];
    });
    return Object.values(sampledData);
  }
  
