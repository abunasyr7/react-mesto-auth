import React from 'react';
import Card from "./Card";
import {CurrentUserContext} from "../contexts/CurrentUserContext";


function Main(props) {
    const currentUser = React.useContext(CurrentUserContext);

    return (
        <main>
            <section className="profile">
                <div className="profile__info-section">
                    <div className="profile__avatar" onClick={props.onEditAvatar}>
                        <img src={currentUser.avatar} alt="Avatar" className="avatar" />
                        <div className="middle">
                            <div className="profile__image"></div>
                        </div>
                    </div>
                    <div className="profile__info">
                        <h1 className="profile__info-name">{currentUser.name}</h1>
                        <p className="profile__info-text">{currentUser.about}</p>
                    </div>
                    <button className="profile__edit-button" type="button" onClick={props.onEditProfile}></button>
                </div>
                <button className="profile__add-button" type="button" onClick={props.onAddPlace}></button>
            </section>
            <div className="elements">
                {
                    props.cards.map((card => (
                    <Card
                        onCardClick={props.onCardClick}
                        onCardLike={props.onCardLike}
                        onCardDelete={props.onCardDelete}
                        key={card._id}
                        card={card}
                    />
                )))
                }
            </div>

            <div className="popup popup-delete">
                <div className="popup__body">
                    <div className="popup__content popup-delete__content">
                        <button className="popup__close close-popup" type="button"></button>
                        <h2 className="popup__title">Вы уверены?</h2>
                        <button className="popup__save" type="submit" value="Reset">Да</button>
                    </div>
                </div>
            </div>


        </main>
    )
}

export default Main;