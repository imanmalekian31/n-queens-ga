class HI {
  constructor(col) {
    this.col = col;
    this.fitness = fitness_evaluation(col);
  }
}

function generate_random_problem() {
  var arr = Array.from({ length: QUEENS_COUNT }, (_v, i) => i);

  for (var i = 0; i < arr.length; i++) {
    var idx = Math.floor(Math.random() * (i + 1));
    var temp = arr[idx];
    arr[idx] = arr[i];
    arr[i] = temp;
  }
  return arr;
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

function find_solution(problem) {
  var best = null;
  for (let i = 0; i < QUEENS_COUNT; i++) {
    for (let j = 0; j < QUEENS_COUNT; j++) {
      var temp = [...problem.col];
      temp[i] = j;
      if (fitness_evaluation(temp) < problem.fitness) {
        best = temp;
      }
    }
  }

  if (best) {
    return new HI(best);
  }
  return problem;
}

function init_hill() {
  //generate random problem
  var problem = new HI(generate_random_problem());

  // start hill climbing algorithm
  console.time("hill");

  while (find_solution(problem).fitness < problem.fitness) {
    problem = find_solution(problem);
  }
  console.timeEnd("hill");

  return problem;
}
