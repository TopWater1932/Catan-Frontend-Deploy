function capsResourceName(name: string): string {
    let capitalised = name.charAt(0).toUpperCase() + name.slice(1);
    return capitalised.split(/(?=[A-Z])/).join(" ");
}

export default capsResourceName;