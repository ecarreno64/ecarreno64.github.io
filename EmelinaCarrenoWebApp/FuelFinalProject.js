// FuelFinalProject.js

const states = [
  'California', 'Texas', 'Florida', 'New York', 'Pennsylvania', 'Illinois',
  'Ohio', 'Georgia', 'North Carolina', 'Michigan', 'New Jersey', 'Virginia',
  'Washington', 'Arizona', 'Massachusetts', 'Tennessee', 'Indiana', 'Missouri',
  'Maryland', 'Wisconsin', 'Colorado', 'Minnesota', 'South Carolina', 'Alabama',
  'Louisiana', 'Kentucky', 'Oregon', 'Oklahoma', 'Connecticut', 'Iowa', 'Utah',
  'Nevada', 'Arkansas', 'Mississippi', 'Kansas', 'New Mexico', 'Nebraska',
  'West Virginia', 'Idaho', 'Hawaii', 'New Hampshire', 'Maine', 'Rhode Island',
  'Montana', 'Delaware', 'South Dakota', 'North Dakota', 'Alaska', 'Vermont',
  'Wyoming', 'District of Columbia'
];

const expenditures = [
  57600, 46140, 31184, 25821, 24625, 20900, 20803, 20011, 19766, 16933,

  16821, 16554, 15899, 15432, 15045, 13987, 13763, 13450, 12987, 12744,

  12003, 11565, 11234, 11009, 10880, 10733, 10321, 10255, 9832, 9687,

  9432, 9021, 8980, 8867, 8774, 8355, 7998, 7770, 7550, 7432, 7211, 7088,

  6990, 6630, 6490, 6340, 5980, 5700, 5560, 5033

];

const breakdownPercentages = {
  crudeOil: 0.50,
  refining: 0.15,
  distribution: 0.10,
  taxes: 0.15,
  fuelCost: 0.10
};

const stateCodes = [
  'CA', 'TX', 'FL', 'NY', 'PA', 'IL', 'OH', 'GA', 'NC', 'MI', 'NJ', 'VA', 'WA', 'AZ', 'MA', 'TN', 'IN', 'MO', 'MD', 'WI',
  'CO', 'MN', 'SC', 'AL', 'LA', 'KY', 'OR', 'OK', 'CT', 'IA', 'UT', 'NV', 'AR', 'MS', 'KS', 'NM', 'NE', 'WV', 'ID', 'HI',
  'NH', 'ME', 'RI', 'MT', 'DE', 'SD', 'ND', 'AK', 'VT', 'WY', 'DC'
];

let currentExpenditureType = 'total';

const hoverText = states.map((state, i) => {
  const total = expenditures[i];
  if (total === undefined || isNaN(total)) {
    return `${state}: Data unavailable`;
  }

  const crude = total * breakdownPercentages.crudeOil;
  const refining = total * breakdownPercentages.refining;
  const dist = total * breakdownPercentages.distribution;
  const taxes = total * breakdownPercentages.taxes;
  const fuel = total * breakdownPercentages.fuelCost;

  return ` 

<b>${state}</b><br> 
Total: $${(total / 1000).toLocaleString()}M<br> 
Crude Oil: $${(crude / 1000).toFixed(1)}M (${(breakdownPercentages.crudeOil * 100)}%)<br> 
Refining: $${(refining / 1000).toFixed(1)}M (${(breakdownPercentages.refining * 100)}%)<br> 
Distribution & Marketing: $${(dist / 1000).toFixed(1)}M (${(breakdownPercentages.distribution * 100)}%)<br> 
Taxes: $${(taxes / 1000).toFixed(1)}M (${(breakdownPercentages.taxes * 100)}%)<br> 
Fuel Cost: $${(fuel / 1000).toFixed(1)}M (${(breakdownPercentages.fuelCost * 100)}%) 
`;
});

const updateMap = () => {
  const type = document.getElementById('expenditureType').value;
  currentExpenditureType = type;
  const data = generateMapData(type);
  Plotly.react('map', data, layout);
};

const generateMapData = (type) => {
  const dataMapping = {
    total: expenditures.map(e => e / 1000),
    crudeOil: expenditures.map((e, i) => (e * breakdownPercentages.crudeOil) / 1000),
    refining: expenditures.map((e, i) => (e * breakdownPercentages.refining) / 1000),
    distribution: expenditures.map((e, i) => (e * breakdownPercentages.distribution) / 1000),
    taxes: expenditures.map((e, i) => (e * breakdownPercentages.taxes) / 1000),
    fuelCost: expenditures.map((e, i) => (e * breakdownPercentages.fuelCost) / 1000),
  };
//Color Scale 
  let colorscale;
  let title;
  switch (type) {
    case 'crudeOil':
      colorscale = [
        [0, 'rgb(255, 255, 255)'],
        [1, 'rgb(0, 0, 0)']
      ];
      title = 'Crude Oil Expenditure (Millions)';
      break;
      //crude oil color scales is black because it is the color of crude oil
    case 'refining':
      colorscale = [
        [0, 'rgb(255, 255, 204)'],
        [1, 'rgb(255, 204, 0)']
      ];
      title = 'Refining Expenditure (Millions)';
      break;
      //refining color scale is yellow because it is related to oil refining
    case 'distribution':
      colorscale = [
        [0, 'rgb(255, 255, 255)'],
        [1, 'rgb(0, 204, 204)']
      ];
      //distribution color scale is cyan because it is related to marketing
      title = 'Distribution & Marketing Expenditure (Millions)';
      break;
    case 'taxes':
      colorscale = [
        [0, 'rgb(255, 255, 255)'],
        [1, 'rgb(0, 102, 204)']
      ];
      title = 'Taxes Expenditure (Millions)';
      break;
      //taxes color scale is blue because it is related to government revenue
    case 'fuelCost':
      colorscale = [
        [0, 'rgb(255, 255, 255)'],
        [1, 'rgb(0, 204, 0)']
      ];
      //green color scale for fuel cost because it is related to monetary value
      title = 'Fuel Cost Expenditure (Millions)';
      break;
    default:
      colorscale = [
        [0, 'rgb(255, 204, 204)'],
        [0.2, 'rgb(255, 153, 153)'],
        [0.4, 'rgb(255, 102, 102)'],
        [0.6, 'rgb(255, 51, 51)'],
        [0.8, 'rgb(204, 0, 0)'],
        [1, 'rgb(139, 0, 0)']
      ];
      title = 'Total Expenditure (Millions)';
  }

  return [{
    type: 'choropleth',
    locationmode: 'USA-states',
    locations: stateCodes,
    z: dataMapping[type],
    text: hoverText,
    hoverinfo: 'text',
    colorscale: colorscale,
    colorbar: {
      title: {
        text: title,
        side: 'right'
      },
      tickprefix: '$',
      ticksuffix: 'M',
      tickfont: { size: 14 },
      titlefont: { size: 16 },
      thickness: 20,
      len: 0.8,
      x: 1,
      xpad: 10
    }
  }];
};

const compareStates = () => {
  const selectedStates = Array.from(document.getElementsByClassName('state-checkbox'))
    .filter(cb => cb.checked)
    .map(cb => cb.value);
  if (selectedStates.length < 2) {
    alert("Please select at least two states to compare.");
    return;
  }
  const selectedExpenditures = selectedStates.map(state => {
    const index = states.indexOf(state);
    return expenditures[index] / 1000; // Convert to millions 
  });
  const comparisonData = [{
    x: selectedStates,
    y: selectedExpenditures,
    type: 'bar',
    marker: {
      color: selectedExpenditures.map((_, i) => `rgb(${i * 50}, 50, 200)`), // Different color for each bar 
      opacity: 0.7
    }
  }];

  const comparisonLayout = {
    title: `Expenditure Comparison for Selected States`,
    xaxis: { title: 'State' },
    yaxis: { title: 'Expenditure in Millions ($)' },
    showlegend: false
  };
  Plotly.newPlot('chart', comparisonData, comparisonLayout);
};

const layout = {
  title: {
    text: '2023 Motor Gasoline Total Expenditure by State',
    font: { size: 24 }
  },
  geo: {
    scope: 'usa',
    projection: { type: 'albers usa' },
    showlakes: true,
    lakecolor: 'rgb(255, 255, 255)'
  }
};
