const Chart = () => {
  // replay;

  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("height", height)
      .attr("style", "max-width: 100%; height: auto;");

  const updateBars = bars(svg);
  const updateAxis = axis(svg);
  const updateLabels = labels(svg);
  const updateTicker = ticker(svg);

  yield svg.node();

  for (const keyframe of keyframes) {
    const transition = svg.transition()
        .duration(duration)
        .ease(d3.easeLinear);

    // Extract the top bar’s value.
    x.domain([0, keyframe[1][0].value]);

    updateAxis(keyframe, transition);
    updateBars(keyframe, transition);
    updateLabels(keyframe, transition);
    updateTicker(keyframe, transition);

    invalidation.then(() => svg.interrupt());
    await transition.end();
  }
}

export default Chart;

// let duration = 250

// let n = 12

// let names = new Set(data.map(d => d.name))

// let datevalues = Array.from(d3.rollup(data, ([d]) => d.value, d => +d.date, d => d.name))
//   .map(([date, data]) => [new Date(date), data])
//   .sort(([a], [b]) => d3.ascending(a, b))

// function rank(value) {
// const data = Array.from(names, name => ({name, value: value(name)}));
// data.sort((a, b) => d3.descending(a.value, b.value));
// for (let i = 0; i < data.length; ++i) data[i].rank = Math.min(n, i);
// return data;
// }

// let k = 10

// keyframes = {
//   const keyframes = [];
//   let ka, a, kb, b;
//   for ([[ka, a], [kb, b]] of d3.pairs(datevalues)) {
//     for (let i = 0; i < k; ++i) {
//       const t = i / k;
//       keyframes.push([
//         new Date(ka * (1 - t) + kb * t),
//         rank(name => (a.get(name) || 0) * (1 - t) + (b.get(name) || 0) * t)
//       ]);
//     }
//   }
//   keyframes.push([new Date(kb), rank(name => b.get(name) || 0)]);
//   return keyframes;
// }

// let nameframes = d3.groups(keyframes.flatMap(([, data]) => data), d => d.name)

// let prev = new Map(nameframes.flatMap(([, data]) => d3.pairs(data, (a, b) => [b, a])))

// let next = new Map(nameframes.flatMap(([, data]) => d3.pairs(data)))

// function bars(svg) {
//   let bar = svg.append("g")
//       .attr("fill-opacity", 0.6)
//     .selectAll("rect");

//   return ([date, data], transition) => bar = bar
//     .data(data.slice(0, n), d => d.name)
//     .join(
//       enter => enter.append("rect")
//         .attr("fill", color)
//         .attr("height", y.bandwidth())
//         .attr("x", x(0))
//         .attr("y", d => y((prev.get(d) || d).rank))
//         .attr("width", d => x((prev.get(d) || d).value) - x(0)),
//       update => update,
//       exit => exit.transition(transition).remove()
//         .attr("y", d => y((next.get(d) || d).rank))
//         .attr("width", d => x((next.get(d) || d).value) - x(0))
//     )
//     .call(bar => bar.transition(transition)
//       .attr("y", d => y(d.rank))
//       .attr("width", d => x(d.value) - x(0)));
// }