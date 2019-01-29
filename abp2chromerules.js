/*
 * This file is part of Adblock Plus <https://adblockplus.org/>,
 * Copyright (C) 2006-present eyeo GmbH
 *
 * Adblock Plus is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * Adblock Plus is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Adblock Plus.  If not, see <http://www.gnu.org/licenses/>.
 */

"use strict";

let readline = require("readline");
let Filter = require("filterClasses").Filter;
let ContentBlockerList = require("./lib/abp2chromerules.js").ContentBlockerList;

var rl = readline.createInterface({input: process.stdin, terminal: false});
var blockerList = new ContentBlockerList();

rl.on("line", line =>
{
  if (/^\s*[^\[\s]/.test(line))
    blockerList.addFilter(Filter.fromText(Filter.normalize(line)));
});

rl.on("close", () =>
{
  let rules = blockerList.generateRules();

  // If the rule set is too huge, JSON.stringify throws
  // "RangeError: Invalid string length" on Node.js. As a workaround, print
  // each rule individually.
  console.log("[");

  for (let i = 0; i < rules.length - 1; i++)
    console.log(JSON.stringify(rules[i], null, "\t") + ",");
  console.log(JSON.stringify(rules[rules.length - 1], null, "\t"));
  console.log("]");
});
