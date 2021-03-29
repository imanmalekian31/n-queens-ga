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

function merge_population() {
  var merged_population = [];
  for (let i = 0; i < POPULATION_SIZE; i += 2) {
    var simple_one = population[i].col;
    var simple_two = population[i + 1].col;
    var slice_idx = Math.floor(Math.random() * QUEENS_COUNT - 1);

    var slice_simple_one_part_1 = simple_one.slice(0, slice_idx);
    var slice_simple_one_part_2 = simple_one.slice(slice_idx, QUEENS_COUNT);

    var slice_simple_two_part_1 = simple_two.slice(0, slice_idx);
    var slice_simple_two_part_2 = simple_two.slice(slice_idx, QUEENS_COUNT);

    simple_one = new GA(
      slice_simple_one_part_1.concat(slice_simple_two_part_2)
    );
    simple_two = new GA(
      slice_simple_two_part_1.concat(slice_simple_one_part_2)
    );

    merged_population.push(...[simple_one, simple_two]);
  }
  population = merged_population;
  sort_population();
}

function init() {
  generate_init_population();
  for (let index = 0; index < MAX_LOOP; index++) {
    merge_population();
    if (population[0].fitness === 0) {
      return index;
    }
  }
  return MAX_LOOP;
}
