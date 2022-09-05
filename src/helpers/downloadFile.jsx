const downloadFile = (filename) =>{
    const link = document.createElement("a");
    link.href = filename;
    link.setAttribute(
        'download',
        filename,
      );
    link.target="_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export {downloadFile};