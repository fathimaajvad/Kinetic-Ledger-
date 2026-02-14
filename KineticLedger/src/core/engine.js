/**
 * KINETIC LEDGER - Neural Growth Engine (Core)
 */

export let stats = {
    technical: 15,
    creative: 15,
    social: 15,
    logic: 15,
    empathy: 15
};

export const API_KEY = "AIzaSyDv7c5h_993EbHoBwhPnhw3RPVfgg6V19A"; 

export function initChart(ctx) {
    return new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['TECHNICAL', 'CREATIVE', 'SOCIAL', 'LOGIC', 'EMPATHY'],
            datasets: [{
                label: 'Human Profile Evolution',
                data: [stats.technical, stats.creative, stats.social, stats.logic, stats.empathy],
                backgroundColor: 'rgba(34, 211, 238, 0.2)',
                borderColor: '#22d3ee',
                pointBackgroundColor: '#e879f9',
                pointBorderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    pointLabels: { color: '#22d3ee', font: { size: 12, family: 'Orbitron', weight: 'bold' } },
                    ticks: { display: false, max: 100, stepSize: 20 },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            },
            plugins: { legend: { display: false } },
            responsive: true,
            maintainAspectRatio: false
        }
    });
}