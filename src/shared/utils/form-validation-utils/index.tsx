export const handleKeyDownNumber = (event: any) => {
    // Get the key code of the pressed key
    const keyCode = event.which || event.keyCode;

    // Check if the key pressed is an alphabet (a-z or A-Z)
    if ((keyCode >= 65 && keyCode <= 90) || (keyCode >= 106 && keyCode <= 122)) {
        // If it's an alphabet, prevent the default behavior
        event.preventDefault();
    }
};

export const handleKeyDownAlphabet = (event: any) => {
    const keyCode = event.which || event.keyCode;
    // Check if the key pressed is a number (0-9)
    if (keyCode >= 48 && keyCode <= 57) {
        // If it's a number, prevent the default behavior
        event.preventDefault();
    }
}