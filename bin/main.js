"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const github_1 = require("@actions/github");
const core = __importStar(require("@actions/core"));
const load = __importStar(require("@commitlint/load"));
const lint = __importStar(require("@commitlint/lint"));
function getPullTitle() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!github_1.context.payload.pull_request) {
            throw new Error('Missing Pull Request in the current context');
        }
        return github_1.context.payload.pull_request.title;
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        // Setting the default configuration for PR linting
        core.debug('Loading commintlint configuration');
        const lintOptions = yield load({
            extends: ['@commitlint/config-conventional']
        });
        // Retrieving current PR title
        let title;
        try {
            core.debug('Retrieving PR title');
            title = yield getPullTitle();
        }
        catch (err) {
            core.error(err.message);
            core.setFailed('Could not to retrieve Pull Request from your Actions\' context');
            console.log('Could not to retrieve Pull Request from your Actions\' context');
            return;
        }
        // Generating linter report
        core.debug('Generating commitlint report');
        const lintReport = yield lint(title, lintOptions.rules, {});
        // If linter's report is fine, then it's the end of this action
        if (lintReport.valid) {
            return;
        }
        lintReport.errors.forEach(error => {
            core.error(`[${error.name}] ${error.message}`);
        });
        core.setFailed(`"${title}" is not a valid Pull Request title!`);
    });
}
run();
