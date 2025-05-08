import {
    Search,
    Sun,
    Moon,
    MessageCircle,      // Muted notifications
    BellPlus
} from 'lucide-react';
import styles from './header.module.css';
import { useTheme } from '../../hooks/themeProvider.tsx';

export default function Header() {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className={styles.container}>
            <div className={styles.headerRow}>
                <h2>Karu Counceling </h2>
                <div className={styles.right}>
                    <button onClick={toggleTheme} className={styles.themeToggle}>
                        {theme ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                    <MessageCircle size={24} className={styles.icon} />
                    <BellPlus size={24} className={styles.icon} />

                </div>
            </div>
            <form action="#" className={styles.searchForm}>
                <input type="text" placeholder="Search for..." />
                <button type="submit" className={styles.searchButton}>
                    <Search size={20} />
                </button>
            </form>
        </div>
    );
}
