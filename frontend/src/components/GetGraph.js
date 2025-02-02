// import axios from 'axios'; // API 
// import { Line } from 'react-chartjs-2';

// export default function GetGraph({data, label}) {
//     console.log(label);
//     return (
//             <div>
//                 <Line
//                     data={{
//                         labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
//                         datasets: [{
//                             label: label,
//                             data: data,
//                             backgroundColor: [
//                                 'rgba(255, 99, 132, 0.2)',
//                                 'rgba(54, 162, 235, 0.2)',
//                                 'rgba(255, 206, 86, 0.2)',
//                                 'rgba(75, 192, 192, 0.2)',
//                                 'rgba(153, 102, 255, 0.2)',
//                                 'rgba(255, 159, 64, 0.2)'
//                             ],
//                             borderColor: [
//                                 '#718096',
//                                 'rgba(54, 162, 235, 1)',
//                                 'rgba(255, 206, 86, 1)',
//                                 'rgba(75, 192, 192, 1)',
//                                 'rgba(153, 102, 255, 1)',
//                                 'rgba(255, 159, 64, 1)'
//                             ],
//                             borderWidth: 3,
//                             color: 'blue'
//                         }]
//                     }}
//                     height={200}
//                     width={400}
//                 />
//             </div>
//         )
// }

import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

export default function GetGraph({ data, label }) {
    const chartData = {
        labels: Array.from({ length: data.length }, (_, i) => i.toString()),
        datasets: [{
            label: label,
            data: data,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 3,
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <div style={{ height: '400px', width: '600px' }}>
            <Line
                data={chartData}
                options={options}
            />
        </div>
    );
}
