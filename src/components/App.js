import React from 'react';
import Header from '../components/Header'
import Footer from "./Footer";
import Main from "./Main";
import EditProfilePopup from "./EditProfilePopup";
import AddPlacePopup from "./AddPlacePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import ImagePopup from "./ImagePopup";
import api from "../utils/api";
import {CurrentUserContext} from "../contexts/CurrentUserContext";

function App() {

    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
    const [selectedCard, setSelectedCard] = React.useState(null);
    const [currentUser, setCurrentUser] = React.useState({});
    const [cards, setCards] = React.useState([])

    React.useEffect(() => {
        api.getUserInfo()
            .then((data) => {
                setCurrentUser(data)
            })
            .catch((err) => {
                console.log(err);
            }, [])

    }, [])

    React.useEffect(() => {
        api.getInitialCards()
            .then((data) => {
                setCards(data);
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    function handleCardClick(card) {
        setSelectedCard(card);
    }

    function handleEditAvatarClick () {
        setIsEditAvatarPopupOpen(true);
    }

    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true);
    }

    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true);
    }
    function closeAllPopup() {
        setIsAddPlacePopupOpen(false);
        setIsEditAvatarPopupOpen(false);
        setIsEditProfilePopupOpen(false);
        setSelectedCard(false)
    }

    function handleCardLike(card) {
        // Снова проверяем, есть ли уже лайк на этой карточке
        const isLiked = card.likes.some(i => i._id === currentUser._id);

        // Отправляем запрос в API и получаем обновлённые данные карточки
        api.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
            setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        })
            .catch((err) => {
                console.log(err);
            });
    }

    function handleCardDelete(card) {
        api.cardDelete(card._id)
            .then(() => {
                setCards((state) => state.filter((c) => c !== card))
            })
            .catch((err) => {
                console.log(err)
            })
    }

    function handleUpdateUser(data) {
        api.editUserData(data)
            .then((data) => {
                setCurrentUser(data)
                closeAllPopup();
            })
            .catch((err) => {
                console.log(err)
            })
    }

    function handleUpdateAvatar(data) {
        api.updateAvatar(data)
            .then((data) => {
                setCurrentUser(data);
                closeAllPopup();
            })
            .catch((err) => {
                console.log(err)
            })
    }

    function handleAddPlacePopup(data) {
        api.addCard(data)
            .then((newCard) => {
                setCards([newCard, ...cards])
                closeAllPopup()
            })
            .catch((err) => {
                console.log(err)
            })
    }

  return (
      <CurrentUserContext.Provider value={currentUser}>
        <div className="page">
              <Header />
              <Main
                  onEditProfile = {handleEditProfileClick}
                  onAddPlace={handleAddPlaceClick}
                  onEditAvatar={handleEditAvatarClick}
                  onCardClick={handleCardClick}
                  cards={cards}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
              />
              <Footer />
                <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopup} onUpdateUser={handleUpdateUser} />
                <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopup} onAddPlace={handleAddPlacePopup} />
                <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopup} onUpdateAvatar={handleUpdateAvatar}/>
                <ImagePopup card={selectedCard !== null && selectedCard}  onClose={closeAllPopup}/>
        </div>
      </CurrentUserContext.Provider>
  );
}

export default App;
