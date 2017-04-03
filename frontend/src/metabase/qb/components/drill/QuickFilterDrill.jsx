/* @flow */

import React from "react";

import { TYPE, isa, isFK, isPK } from "metabase/lib/types";
import { filter } from "metabase/qb/lib/actions";

import type {
    ClickAction,
    ClickActionProps
} from "metabase/meta/types/Visualization";

function getFiltersForColumn(column) {
    if (isFK(column.special_type) || isPK(column.special_type)) {
        return;
    }

    if (
        isa(column.base_type, TYPE.Number) ||
        isa(column.base_type, TYPE.DateTime)
    ) {
        return [
            { name: "<", operator: "<" },
            { name: "=", operator: "=" },
            { name: "≠", operator: "!=" },
            { name: ">", operator: ">" }
        ];
    } else {
        return [{ name: "=", operator: "=" }, { name: "≠", operator: "!=" }];
    }
}

export default (
    { card, tableMetadata, clicked }: ClickActionProps
): ?ClickAction => {
    if (
        !clicked ||
        !clicked.column ||
        clicked.column.id == null ||
        clicked.value == undefined
    ) {
        return;
    }

    const { value, column } = clicked;

    let operators = getFiltersForColumn(column);
    if (!operators) {
        return;
    }

    return {
        title: (
            <span>
                Filter by this value
            </span>
        ),
        default: true,
        popover({ onChangeCardAndRun, onClose }) {
            return (
                <ul className="h1 flex align-center px1">
                    {operators &&
                        operators.map(({ name, operator }) => (
                            <li
                                key={operator}
                                className="p2 text-brand-hover cursor-pointer"
                                onClick={() => {
                                    onChangeCardAndRun(
                                        filter(card, operator, column, value)
                                    );
                                }}
                            >
                                {name}
                            </li>
                        ))}
                </ul>
            );
        }
    };
};
