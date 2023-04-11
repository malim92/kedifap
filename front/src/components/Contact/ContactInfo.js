export default function ContactInfo() {
    const pClasses = "pt-3 pb-1";
    return (
        <>
        <div className="basis-1/3">
            <p className={pClasses}>
                <span className="font-bold">Διεύθυνση:</span> Βιομηχανική Περιοχή Ανατολικού <br />
                TK: 8501, Πάφος - Κύπρος <br />
                Τ.θ: 62410, Τ.Τ: 8064  
            </p>
            <p className={pClasses}>
            <span className="font-bold">Τηλέφωνο επικοινωνίας:</span>  <br />
                26 819 595<br />
                Fax:<br />
                26 6000 605  
            </p>
        </div>
        <div className="basis-1/3">
            <p className={pClasses}>
            <span className="font-bold">Τμήμα Εξυπηρέτησης Πελατών:</span><br />
                customer-service@kedifap.com  
            </p>
            <p className={pClasses}>
            <span className="font-bold">Γενικό Email:</span><br />
                info@kedifap.com
            </p>
        </div>
        </>
    );
}