import { 
  FaInstagram, FaFacebook, FaTwitter, FaYoutube, FaGithub, FaLinkedin, 
  FaEnvelope, FaGlobe, FaMapMarkerAlt, FaPhone, FaShoppingCart, FaWhatsapp, 
  FaMusic, FaCamera, FaVideo, FaBriefcase, FaUser, FaHeart, FaStar, FaLink,
  FaTiktok, FaTwitch, FaDiscord, FaSnapchat, FaSpotify
} from "react-icons/fa";
import { IconType } from "react-icons";

export const ICON_MAP: Record<string, IconType> = {
  "Instagram": FaInstagram,
  "Facebook": FaFacebook,
  "Twitter": FaTwitter,
  "Youtube": FaYoutube,
  "Github": FaGithub,
  "Linkedin": FaLinkedin,
  "Mail": FaEnvelope,
  "Globe": FaGlobe,
  "MapPin": FaMapMarkerAlt,
  "Phone": FaPhone,
  "ShoppingCart": FaShoppingCart,
  "Whatsapp": FaWhatsapp,
  "Music": FaMusic,
  "Camera": FaCamera,
  "Video": FaVideo,
  "Briefcase": FaBriefcase,
  "User": FaUser,
  "Heart": FaHeart,
  "Star": FaStar,
  "Link": FaLink,
  "Tiktok": FaTiktok,
  "Twitch": FaTwitch,
  "Discord": FaDiscord,
  "Snapchat": FaSnapchat,
  "Spotify": FaSpotify
};

export const COMMON_ICONS = Object.keys(ICON_MAP);

export function getIcon(name: string): IconType {
  if (!name) return FaLink;
  
  // Case-insensitive lookup
  const key = Object.keys(ICON_MAP).find(
    k => k.toLowerCase() === name.toLowerCase()
  );
  
  return key ? ICON_MAP[key] : FaLink;
}
