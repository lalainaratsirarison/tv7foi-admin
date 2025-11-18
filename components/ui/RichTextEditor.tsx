"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { TextStyle } from '@tiptap/extension-text-style'; 
import { Color } from '@tiptap/extension-color';       
import Underline from '@tiptap/extension-underline';

import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';

// Icônes de lucide-react (maintenues pour la compatibilité)
import { 
    Bold, Italic, List, ListOrdered, Code, Heading, Palette, Loader2, Underline as UnderlineIcon 
} from 'lucide-react';
import { useCallback, useState } from 'react';

// --- Couleurs de base ---
const COLORS = [
  '#000000', 
  '#ef4444', 
  '#3b82f6', 
  '#10b981', 
];

// --- Hook pour la résolution d'hydratation (maintenu) ---
const useHasMounted = () => {
    const [hasMounted, setHasMounted] = useState(false);
    // useEffect est exécuté uniquement côté client après le premier rendu
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useState(() => { setHasMounted(true) }); 
    return hasMounted;
};


// --- Composant de la Barre d'Outils ---
interface MenuBarProps {
  editor: any;
}

const MenuBar: React.FC<MenuBarProps> = ({ editor }) => {
    // 🟢 État local pour gérer le niveau de titre sélectionné
    const [headingLevel, setHeadingLevel] = useState(2); 

    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href;
        // Remplacer window.prompt par une modale custom dans une application de production
        const url = window.prompt('URL:', previousUrl);
        if (url === null) return;
        if (url === '') {
          editor.chain().focus().extendMarkRange('link').unsetLink().run();
          return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
      }, [editor]);
      
      const resetColor = useCallback(() => {
        editor.chain().focus().unsetColor().run();
      }, [editor]);
    
      const baseClass = "p-2 rounded hover:bg-gray-200 transition";
      const activeClass = "bg-primary-100 text-primary-800";
      const activeColor = editor.getAttributes('textStyle').color || '#000000';
    
    // Fonction pour mettre à jour le niveau de titre et l'état
    const handleHeadingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const level = Number(e.target.value);
        setHeadingLevel(level);
        if (level === 0) {
            editor.chain().focus().setParagraph().run();
        } else {
            editor.chain().focus().toggleHeading({ level }).run();
        }
    };
    
    // Fonction pour déterminer le niveau actuel du curseur pour l'affichage
    const getCurrentHeadingLevel = () => {
        for (let i = 1; i <= 6; i++) {
            if (editor.isActive('heading', { level: i })) {
                return i;
            }
        }
        return 0; // 0 pour le paragraphe (P)
    };


    if (!editor) { return null; }

    return (
        <div className="flex flex-wrap items-center space-x-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-xl">
        
        {/* 🟢 SÉLECTEUR DE NIVEAU DE TITRE */}
        <div className="relative">
             <button 
                type="button" 
                className={`${baseClass} w-10 h-10 flex items-center justify-center 
                ${editor.isActive('heading') ? activeClass : 'text-gray-600'}`}
                title={`Titre H${getCurrentHeadingLevel() > 0 ? getCurrentHeadingLevel() : 'P'}`}
            >
                <Heading size={18} />
            </button>
            <select
                value={getCurrentHeadingLevel()}
                onChange={handleHeadingChange}
                className="absolute top-0 left-0 opacity-0 w-full h-full cursor-pointer appearance-none"
            >
                <option value={0}>Paragraphe (P)</option>
                {[1, 2, 3, 4, 5, 6].map((level) => (
                    <option key={level} value={level}>
                        Titre H{level}
                    </option>
                ))}
            </select>
        </div>
        {/* Fin SÉLECTEUR DE NIVEAU DE TITRE */}

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`${baseClass} ${editor.isActive('bold') ? activeClass : 'text-gray-600'}`}
            title="Gras (Ctrl+B)"
        >
            <Bold size={18} />
        </button>

        <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`${baseClass} ${editor.isActive('italic') ? activeClass : 'text-gray-600'}`}
            title="Italique (Ctrl+I)"
        >
            <Italic size={18} />
        </button>

        <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()} 
            disabled={!editor.can().chain().focus().toggleUnderline().run()}
            className={`${baseClass} ${editor.isActive('underline') ? activeClass : 'text-gray-600'}`}
            title="Souligné (Ctrl+U)"
        >
            <UnderlineIcon size={18} />
        </button>
        
        <div className="w-px h-6 bg-gray-300 mx-1" />

        <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`${baseClass} ${editor.isActive('bulletList') ? activeClass : 'text-gray-600'}`}
            title="Liste à puces"
        >
            <List size={18} />
        </button>

        <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`${baseClass} ${editor.isActive('orderedList') ? activeClass : 'text-gray-600'}`}
            title="Liste numérotée"
        >
            <ListOrdered size={18} />
        </button>
        
        <div className="w-px h-6 bg-gray-300 mx-1" />

        <button
            type="button"
            onClick={setLink}
            className={`${baseClass} ${editor.isActive('link') ? activeClass : 'text-gray-600'}`}
            title="Ajouter un lien"
        >
            <Code size={18} />
        </button>
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        {/* Contrôles de Couleur */}
        <div className="flex items-center space-x-2">
            
            <button
            type="button"
            onClick={resetColor}
            className={`${baseClass} text-gray-600`}
            title="Réinitialiser la couleur"
            >
            <Palette size={18} />
            </button>
            
            <label htmlFor="color-picker" className="sr-only">Choisir couleur</label>
            <input
                id="color-picker"
                type="color"
                onInput={(event) => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
                value={activeColor}
                className="w-8 h-8 cursor-pointer rounded-full border-2 border-gray-400 p-0 overflow-hidden bg-white"
                title="Sélecteur de palette"
            />

            {COLORS.map((color) => (
            <button
                key={color}
                type="button"
                onClick={() => editor.chain().focus().setColor(color).run()}
                className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 
                ${editor.isActive('textStyle', { color }) ? 'border-gray-800 scale-110' : 'border-white'}`
                }
                style={{ backgroundColor: color }}
                title={color}
            />
            ))}

        </div>
        
        </div>
    );
};


// --- Composant principal de l'éditeur (RichTextEditor) ---
interface RichTextEditorProps {
  content: string;
  onChange: (htmlContent: string) => void;
  disabled: boolean;
  placeholder: string;
}

export type { RichTextEditorProps }; 

export const RichTextEditorComponent: React.FC<RichTextEditorProps> = ({ 
  content, 
  onChange, 
  disabled,
  placeholder 
}) => {
  const hasMounted = useHasMounted();

  const editor = useEditor({
    extensions: [
      // 💡 CORRECTION : On désactive les extensions dupliquées dans StarterKit
      StarterKit.configure({
        codeBlock: false,
        // DÉSACTIVER LES NODES DE BLOC POUR LES AJOUTER SÉPARÉMENT
        bulletList: false,
        orderedList: false,
        listItem: false,
        // 🔴 IMPORTANT : Désactiver heading dans StarterKit car nous le gérons manuellement
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        // Désactiver 'underline' et 'link' pour les ajouter manuellement
        underline: false,
        link: false,
      }),
      // On ajoute 'Underline' manuellement.
      Underline,
      // On ajoute 'Link' manuellement avec une configuration spécifique.
      Link.configure({
        openOnClick: false,
        validate: (href) => /^https?:\/\//.test(href) || /^mailto:/.test(href),
      }),
      Placeholder.configure({
        placeholder: placeholder,
      }),
      TextStyle.configure(), 
      Color.configure({ types: ['textStyle'] }),
      
      // AJOUT EXPLICITE DES EXTENSIONS DE LISTE POUR STABILITÉ
      ListItem.configure(), 
      BulletList.configure(), 
      OrderedList.configure(),
    ],
    content: content,
    // ⚠️ CLÉ POUR ÉVITER LES ERREURS D'HYDRATATION CÔTÉ SERVEUR
    immediatelyRender: false, 
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editable: !disabled,
    editorProps: {
      attributes: {
        // Applique la classe pour le ciblage CSS
        class: 'tiptap-content min-h-[300px] p-4 text-lg outline-none focus:ring-0',
      },
    },
  }, [disabled, placeholder, hasMounted]);

  // Rendu conditionnel minimal pour le chargement de Tiptap
  if (!hasMounted || !editor) {
    return (
        <div className="min-h-[300px] p-4 text-lg border-2 border-gray-200 rounded-2xl flex items-center justify-center bg-gray-50">
            <Loader2 className="animate-spin text-primary-500 mr-2" size={24} /> 
            Chargement de l'éditeur...
        </div>
    );
  }

  return (
    // Ajout d'une balise <style> pour encapsuler les styles locaux
    <div className={`tiptap-editor-wrapper border-2 border-gray-200 rounded-2xl transition overflow-hidden ${disabled ? 'opacity-70 bg-gray-50 cursor-not-allowed' : 'focus-within:border-primary-500'}`}>
      {/* Utilisation de "jsx global" pour injecter des styles globaux confinés au composant */}
      <style jsx global>{`
        /* Styles spécifiques pour l'éditeur Tiptap.
          Ils ciblent uniquement les éléments générés par Tiptap 
          à l'intérieur du conteneur parent (tiptap-editor-wrapper) 
          avec la classe 'tiptap-content' (qui est le ProseMirror)
        */

        /* Style des En-têtes (H1-H6) */
        .tiptap-editor-wrapper .tiptap-content h1 {
            font-size: 2rem;
            font-weight: 700;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
        }
        .tiptap-editor-wrapper .tiptap-content h2 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
        }
        .tiptap-editor-wrapper .tiptap-content h3 {
            font-size: 1.25rem;
            font-weight: 500;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
        }
        .tiptap-editor-wrapper .tiptap-content h4 {
            font-size: 1rem;
            font-weight: 400;
            margin-top: 1rem;
            margin-bottom: 0.5rem;
        }
        .tiptap-editor-wrapper .tiptap-content h5 {
            font-size: 0.875rem;
            font-weight: 300;
            margin-top: 1rem;
            margin-bottom: 0.5rem;
        }
        .tiptap-editor-wrapper .tiptap-content h6 {
            font-size: 0.75rem;
            font-weight: 200;
            margin-top: 1rem;
            margin-bottom: 0.5rem;
        }
        
        /* Style des Liens (Nouveau) */
        .tiptap-editor-wrapper .tiptap-content a {
            color: #3b82f6; /* Bleu */
            text-decoration: none;
            transition: color 0.2s, text-decoration 0.2s;
        }
        .tiptap-editor-wrapper .tiptap-content a:hover {
            text-decoration: underline;
        }


        /* Styles de listes demandés */
        .tiptap-editor-wrapper .tiptap-content ul {
            list-style-type: disc;
            padding-left: 2rem; 
            margin: 1rem 0;
        }

        .tiptap-editor-wrapper .tiptap-content ul li {
            margin-bottom: 0.5rem;
        }
        .tiptap-editor-wrapper .tiptap-content ol {
            list-style-type: decimal;
            padding-left: 2rem; 
            margin: 1rem 0;
        }

        .tiptap-editor-wrapper .tiptap-content ol li {
            margin-bottom: 0.5rem;
        }
        
        /* Assurer que le paragraphe par défaut a un espacement nul (important pour Tiptap) */
        .tiptap-editor-wrapper .tiptap-content p {
            margin: 0;
        }
        /* Assurer un espacement pour les blocks de code */
        .tiptap-editor-wrapper .tiptap-content pre {
            margin: 1rem 0;
            padding: 0.5rem;
            background: #eee;
            border-radius: 4px;
        }
      `}</style>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};