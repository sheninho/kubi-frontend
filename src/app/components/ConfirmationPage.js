
const ConfirmationPage = ({onClick}) => {

    return (
        <div>
            <p>Compte créé avec succès</p>
            
            <button onClick={onClick} className="primary mt-5" >Se connecter</button>
        </div>
    );
};

export default ConfirmationPage;
