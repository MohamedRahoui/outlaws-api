function new_tab() {
    TAB_NAME=$1
    DELAY=$2
    COMMAND=$3
    osascript \
        -e "tell application \"Terminal\"" \
        -e "tell application \"System Events\" to keystroke \"t\" using {command down}" \
        -e "do script \"$DELAY; printf '\\\e]1;$TAB_NAME\\\a'; $COMMAND\" in front window" \
        -e "end tell" >/dev/null
}

new_tab "API TS Watch" \
    "echo 'Loading API Watch...'" \
    "outlaws-api; yarn watch;"

new_tab "API Node SERVER" \
    "echo 'Waiting for TS watch...'; sleep 5" \
    "outlaws-api; yarn dev;"

new_tab "SPA SERVER" \
    "echo 'Waiting for API Server...'" \
    "outlaws-spa; yarn dev;"
