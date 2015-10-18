function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function escapeSource(string) {
    return escapeRegExp(string).replace(/\/+/g, '/+')
}

function _compilePattern(pattern) {
    let regexpSource = '';
    const paramNames = [];
    const tokens = [];

    let match, lastIndex = 0, matcher = /:([a-zA-Z_$][a-zA-Z0-9_$]*)|\*|\(|\)/g;
    while ((match = matcher.exec(pattern))) {
        if (match.index !== lastIndex) {
            tokens.push(pattern.slice(lastIndex, match.index));
            regexpSource += escapeSource(pattern.slice(lastIndex, match.index));
        }

        if (match[1]) {
            regexpSource += '([^/?#]+)';
            paramNames.push(match[1])
        } else if (match[0] === '*') {
            regexpSource += '([\\s\\S]*?)';
            paramNames.push('splat')
        } else if (match[0] === '(') {
            regexpSource += '(?:'
        } else if (match[0] === ')') {
            regexpSource += ')?'
        }

        tokens.push(match[0]);

        lastIndex = matcher.lastIndex
    }

    if (lastIndex !== pattern.length) {
        tokens.push(pattern.slice(lastIndex, pattern.length));
        regexpSource += escapeSource(pattern.slice(lastIndex, pattern.length));
    }

    return {
        pattern,
        regexpSource,
        paramNames,
        tokens
    }
}

const CompiledPatternsCache = {};

function compilePattern(pattern) {
    if (!(pattern in CompiledPatternsCache))
        CompiledPatternsCache[pattern] = _compilePattern(pattern);

    return CompiledPatternsCache[pattern]
}

let result = compilePattern('Layou  t2/:use rId?param=weqwewe&param2=sdfhdfhjdf');

console.log(JSON.stringify(result, null, 4));