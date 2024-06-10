import {
  Field,
  SmartContract,
  method,
  Bool,
  state,
  State,
  Poseidon,
  Struct,
  Provable,
  Reducer,
  PublicKey,
  ZkProgram,
} from 'o1js';

export class Sudoku extends Struct({
  value: Provable.Array(Provable.Array(Field, 9), 9),
}) {
  static from(value: number[][]) {
    return new Sudoku({ value: value.map((row) => row.map(Field)) });
  }

  hash() {
    return Poseidon.hash(this.value.flat());
  }
}

/**
 * Sudoku solution proof as a ZkProgram that can be used either for a Mina
 * network contract OR in another context where proofs can be imported and
 * validated by o1js.
 */
export const SudokuSolution = ZkProgram({
  name: 'SudokuSolution',

  /** The public input of a sudoku solution proof is the unsolved board. */
  publicInput: Sudoku,

  methods: {
    solve: {
      privateInputs: [Sudoku],

      async method(
        /** Public input: the puzzle to be solved. */
        sudokuInstance: Sudoku,
        /** Private input: the solution. */
        solutionInstance: Sudoku,
      ) {
        let sudoku = sudokuInstance.value;
        let solution = solutionInstance.value;

        // first, we check that the passed solution is a valid sudoku

        // define helpers
        let range9 = Array.from({ length: 9 }, (_, i) => i);
        let oneTo9 = range9.map((i) => Field(i + 1));

        function assertHas1To9(array: Field[]) {
          oneTo9
            .map((k) => range9.map((i) => array[i].equals(k)).reduce(Bool.or))
            .reduce(Bool.and)
            .assertTrue('array contains the numbers 1...9');
        }

        // check all rows
        for (let i = 0; i < 9; i++) {
          let row = solution[i];
          assertHas1To9(row);
        }
        // check all columns
        for (let j = 0; j < 9; j++) {
          let column = solution.map((row) => row[j]);
          assertHas1To9(column);
        }
        // check 3x3 squares
        for (let k = 0; k < 9; k++) {
          let [i0, j0] = divmod(k, 3);
          let square = range9.map((m) => {
            let [i1, j1] = divmod(m, 3);
            return solution[3 * i0 + i1][3 * j0 + j1];
          });
          assertHas1To9(square);
        }

        // next, we check that the solution extends the initial sudoku
        for (let i = 0; i < 9; i++) {
          for (let j = 0; j < 9; j++) {
            let cell = sudoku[i][j];
            let solutionCell = solution[i][j];
            // either the sudoku has nothing in it (indicated by a cell value of 0),
            // or it is equal to the solution
            Bool.or(cell.equals(0), cell.equals(solutionCell)).assertTrue(
              `solution cell (${i + 1},${j + 1}) matches the original sudoku`
            );
          }
        }
      }
    }
  }
});

export class SudokuSolutionProof extends ZkProgram.Proof(SudokuSolution) {}

export class SudokuZkApp extends SmartContract {
  @state(Field) sudokuHash = State<Field>();
  @state(Bool) isSolved = State<Bool>();

  static events = {
    "puzzle-reset": Field,
    "puzzle-solved": Field,
    "puzzle-state": Field,
  } as const;
  events = SudokuZkApp.events;

  reducer = Reducer({ actionType: PublicKey });

  /**
   * by making this a `@method`, we ensure that a proof is created for the state initialization.
   * alternatively (and, more efficiently), we could have used `super.init()` inside `update()` below,
   * to ensure the entire state is overwritten.
   * however, it's good to have an example which tests the CLI's ability to handle init() decorated with `@method`.
   */
  @method async init() {
    super.init();
  }

  @method async update(sudokuInstance: Sudoku) {
    this.sudokuHash.set(sudokuInstance.hash());
    this.isSolved.set(Bool(false));
    // example event: announce when the puzzle is reset
    this.emitEvent("puzzle-reset", sudokuInstance.hash());
    // a second event is somewhat redundant, but it illustrates multiple events
    this.emitEvent("puzzle-state", Field(1234));
  }

  @method async submitSolution(
    proof: SudokuSolutionProof,
  ) {
    // Verify the proof first. Note that structuring this method as accepting a
    // proof as input means we must first prove SudokuSolution and then prove
    // this contract method, which is slower than just proving this contract
    // method. However, the SudokoSolutionProof is re-usable in other contacts,
    // while the smart contract method is less so.
    proof.verify();

    // finally, we check that the sudoku is the one that was originally deployed
    let sudokuHash = this.sudokuHash.getAndRequireEquals();

    proof.publicInput
      .hash()
      .assertEquals(sudokuHash, 'sudoku matches the one committed on-chain');

    // all checks passed => the sudoku is solved!
    this.isSolved.set(Bool(true));
    // example event: announce when the puzzle is solved, but not the solution itself
    this.emitEvent("puzzle-solved", proof.publicInput.hash());
    // a second event is somewhat redundant, but it illustrates multiple events
    this.emitEvent("puzzle-state", Field(5678));
    // example action: track the set of all accounts that have ever solved a puzzle
    this.reducer.dispatch(this.sender.getAndRequireSignature());
  }
}

function divmod(k: number, n: number) {
  let q = Math.floor(k / n);
  return [q, k - q * n];
}
