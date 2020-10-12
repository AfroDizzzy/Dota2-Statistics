
barChartObjectStartTime: any;


barChartObjectStartTime = {
    barChartOptions: {
     responsive: true},
   barChartLabels: this.starttime() ,
   barChartType: 'bar',
   barChartLegend: true,
   barChartPlugins: [],
   barChartData: [
     {barPercentage: 1, data: [], label: 'Wins' },
     {data:[], label: 'Loses'}
   ]  
 };
