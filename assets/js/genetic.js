const POPULATION_SIZE = 100;
const QUEENS_COUNT = 8;
const MAX_LOOP = 100;

let population = [];

class GA {
  constructor(col) {
    this.col = col;
    this.fitness = fitness_evaluation(col);
  }
}

function generate_random_population() {
  var arr = Array.from({ length: QUEENS_COUNT }, (_v, i) => i);

  for (var i = 0; i < arr.length; i++) {
    var idx = Math.floor(Math.random() * (i + 1));
    var temp = arr[idx];
    arr[idx] = arr[i];
    arr[i] = temp;
  }
  return arr;
}

function generate_init_population() {
  for (var i = 0; i < POPULATION_SIZE; i++) {
    const col = new GA(generate_random_population());
    population.push(col);
  }
  sort_population();
}

function sort_population() {
  population.sort((a, b) => a.fitness - b.fitness);
}

function fitness_evaluation(col) {
  var clashes = 0;

  for (let i = 0; i < col.length; i++) {
    for (let j = i + 1; j < col.length; j++) {
      if (col[i] === col[j]) {
        clashes++;
      } else if (j - i === col[j] - col[i] || j - i === col[i] - col[j]) {
        clashes++;
      }
    }
  }

  return clashes;
}

function merge_population(gn_1, gn_2) {
  var slice_idx = Math.floor(Math.random() * QUEENS_COUNT - 1);

  var slice_gn_1_part_1 = gn_1.slice(0, slice_idx);
  var slice_gn_1_part_2 = gn_1.slice(slice_idx, QUEENS_COUNT);

  var slice_gn_2_part_1 = gn_2.slice(0, slice_idx);
  var slice_gn_2_part_2 = gn_2.slice(slice_idx, QUEENS_COUNT);

  var new_gn_1 = new GA(slice_gn_1_part_1.concat(slice_gn_2_part_2));
  var new_gn_2 = new GA(slice_gn_2_part_1.concat(slice_gn_1_part_2));

  return [new_gn_1, new_gn_2];
}

function init_ga() {
  //generate init population
  generate_init_population();

  // merge loops
  console.time("ga");
  for (let index = 0; index < MAX_LOOP; index++) {
    //merge
    var merged_population = [];
    for (let i = 0; i < POPULATION_SIZE; i += 2) {
      var gn_1 = population[i].col;
      var gn_2 = population[i + 1].col;

      if (
        i === POPULATION_SIZE - 2 &&
        population[i].fitness < population[i + 1].fitness
      ) {
        gn_2 = population[i].col;
      }

      var new_gns = merge_population(gn_1, gn_2);
      merged_population.push(...new_gns);
    }
    population = merged_population;
    sort_population();

    //find best
    if (population[0].fitness === 0) {
      console.timeEnd("ga");
      return index;
    }
  }
  console.timeEnd("ga");
  return MAX_LOOP;
}
