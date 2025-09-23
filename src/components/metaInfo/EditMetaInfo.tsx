import React, { useState, useEffect, useRef, useMemo } from "react";
import { ArrowLeft, BookOpen, MapPin, RefreshCw } from "lucide-react";
import { BiSolidCategory } from "react-icons/bi";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllPincodes, updateCagegorySearchDetails } from "../../api/apiMethods";
import { useCategoryContext } from "../Context/CategoryContext";
import JoditEditor, { Jodit } from "jodit-react";

interface SearchContent {
  id: string;
  categoryId: string;
  categoryName: string;
  areaName: string;
  city: string;
  state: string;
  pincode: string;
  meta_title: string;
  meta_description: string;
  seo_content: string;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  _id: string;
  category_name: string;
  category_image: string | null;
  category_slug: string;
  meta_title: string;
  meta_description: string;
  status: number;
}

interface Pincode {
  code: string;
  city: string;
  state: string;
  areas: Area[];
}

interface Area {
  name: string;
  subAreas: SubArea[];
}

interface SubArea {
  name: string;
  _id?: string;
}

interface FormData {
  categoryId: string;
  areaName: string;
  city: string;
  state: string;
  pincode: string;
  metaTitle: string;
  metaDescription: string;
  seoContent: string;
}

const EditMetaInfo: React.FC = () => {
  const location = useLocation();
  const searchContent = (location.state as { content?: SearchContent })?.content;
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategoryContext();
  const navigate = useNavigate();
  const editor = useRef<Jodit | null>(null);

  // States
  const [pincodeData, setPincodeData] = useState<Pincode[]>([]);
  const [areaOptions, setAreaOptions] = useState<Area[]>([]);
  const [subAreaOptions, setSubAreaOptions] = useState<SubArea[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<{
    name: string;
    slug: string;
    id: string;
  }>({ name: "", slug: "", id: "" });
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [selectedPincode, setSelectedPincode] = useState<string>("");
  const [selectedSubArea, setSelectedSubArea] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    categoryId: "",
    areaName: "",
    city: "",
    state: "",
    pincode: "",
    metaTitle: "",
    metaDescription: "",
    seoContent: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const cityOptions = ["Hyderabad"];

  // JoditEditor configuration
// const config = useMemo(
//      () => ({
//        readonly: false,
//        placeholder: "Start typing your SEO content...",
//        minHeight: 400,
//        buttons: [
//          "bold",
//          "italic",
//          "underline",
//          "strikethrough",
//          "|",
//          "h1",
//          "h2",
//          "h3",
//          "h4",
//          "h5",
//          "h6",
//          "|",
//          {
//            name: "ul",
//            tooltip: "Insert Unordered List",
//            icon: "ul",
//            list: {
//              disc: "Disc",
//              circle: "Circle",
//              square: "Square",
//            },
//            exec: (editor: Jodit, event: any, { control }: any) => {
//              const style = control.args ? control.args[0] : "disc";
//              editor.execCommand("insertUnorderedList");
//              const ul = editor.selection.getNode()?.closest("ul");
//              if (ul) {
//                ul.style.listStyleType = style;
//              }
//            },
//          },
//          {
//            name: "ol",
//            tooltip: "Insert Ordered List",
//            icon: "ol",
//            list: {
//              decimal: "Numbers",
//              "upper-roman": "Upper Roman",
//              "lower-alpha": "Lower Alpha",
//              "lower-roman": "Lower Roman",
//              "upper-alpha": "Upper Alpha",
//            },
//            exec: (editor: Jodit, event: any, { control }: any) => {
//              const style = control.args ? control.args[0] : "decimal";
//              editor.execCommand("insertOrderedList");
//              const ol = editor.selection.getNode()?.closest("ol");
//              if (ol) {
//                ol.style.listStyleType = style;
//              }
//            },
//          },
//          "|",
//          "link",
//          "image",
//          {
//            name: "table",
//            tooltip: "Insert Table",
//            icon: "table",
//            popup: (editor: Jodit) => {
//              return editor.create.inside.element("div", {
//                class: "jodit_popup_table",
//                innerHTML: `
//                  <div>
//                    <label>Rows: <input type="number" min="1" value="2" class="jodit_table_rows"></label>
//                    <label>Cols: <input type="number" min="1" value="2" class="jodit_table_cols"></label>
//                    <button type="button" class="jodit_table_insert">Insert</button>
//                  </div>
//                `,
//              });
//            },
//            exec: (editor: Jodit, event: any, { control }: any) => {
//              const popup = control.control.popup;
//              const rowsInput = popup.querySelector(".jodit_table_rows") as HTMLInputElement;
//              const colsInput = popup.querySelector(".jodit_table_cols") as HTMLInputElement;
//              const insertButton = popup.querySelector(".jodit_table_insert") as HTMLButtonElement;
//              insertButton.onclick = () => {
//                const rows = parseInt(rowsInput.value) || 2;
//                const cols = parseInt(colsInput.value) || 2;
//                const table = editor.create.inside.element("table");
//                for (let i = 0; i < rows; i++) {
//                  const tr = editor.create.inside.element("tr");
//                  for (let j = 0; j < cols; j++) {
//                    const td = editor.create.inside.element("td");
//                    td.innerHTML = "&nbsp;";
//                    tr.appendChild(td);
//                  }
//                  table.appendChild(tr);
//                }
//                editor.selection.insertNode(table);
//                console.log("Table inserted:", table.outerHTML);
//              };
//            },
//          },
//          "|",
//          "undo",
//          "redo",
//          "|",
//          "align",
//          "font",
//          "fontsize",
//          "|",
//          "source",
//          "fullsize",
//        ],
//        enableDragAndDropFileToEditor: true,
//        copyFormat: true,
//        pasteFromWord: true,
//        pasteFromWordClean: true,
//        askBeforePasteHTML: false,
//        askBeforePasteFromWord: false,
//        defaultActionOnPaste: "insert_as_html",
//        pastePlain: false,
//        cleanHTML: {
//          cleanOnPaste: false,
//          removeEmptyElements: false,
//          fillEmptyParagraph: false,
//          replaceOldTags: false,
//          cleanWordHTML: true,
//          allowTags: {
//            p: { class: true, style: true },
//            div: { class: true, style: true },
//            span: { class: true, style: true },
//            ul: { "list-style-type": true, class: true, style: true },
//            ol: { "list-style-type": true, class: true, style: true },
//            li: { class: true, style: true },
//            b: true,
//            strong: true,
//            i: true,
//            em: true,
//            a: { href: true, target: true, rel: true },
//            img: { src: true, alt: true, class: true, style: true },
//            h1: { class: true, style: true },
//            h2: { class: true, style: true },
//            h3: { class: true, style: true },
//            h4: { class: true, style: true },
//            h5: { class: true, style: true },
//            h6: { class: true, style: true },
//            table: { class: true, style: true, border: true, cellpadding: true, cellspacing: true },
//            tr: { class: true, style: true },
//            td: { class: true, style: true, colspan: true, rowspan: true },
//            th: { class: true, style: true, colspan: true, rowspan: true },
//            tbody: { class: true, style: true },
//            thead: { class: true, style: true },
//            tfoot: { class: true, style: true },
//            caption: { class: true, style: true },
//            blockquote: { class: true, style: true },
//            br: true,
//          },
//          denyTags: ["script", "style", "meta", "o:p", "w:sdtdoc"],
//          cleanAttributes: [], // Disable attribute cleaning to preserve table attributes
//        },
//        clipboard: {
//          useNativeClipboard: true,
//          cleanPastedHTML: false,
//        },
//        disablePlugins: [], // Ensure table plugin is not disabled
//        table: {
//          allowResize: true,
//          allowMerge: true,
//          allowSplit: true,
//        },
//        uploader: {
//          insertImageAsBase64URI: true,
//          imagesExtensions: ["jpg", "png", "jpeg", "gif"],
//        },
//        style: {
//          fontFamily: "Arial, sans-serif",
//        },
//        events: {
//          afterInit: (editor: Jodit) => {
//            console.log("JoditEditor initialized with content:", editor.getEditorValue());
//          },
//          change: (newContent: string) => {
//            console.log("Editor content changed:", newContent);
//          },
//          focus: () => {
//            console.log("Editor focused, current content:", editor.current?.getEditorValue());
//          },
//          afterInsertNode: (node: Node) => {
//            console.log("Node inserted:", node.outerHTML || node.textContent);
//          },
//        },
//      }),
//      []
//    );

const config = useMemo(
     () => ({
       readonly: false,
       placeholder: "Start typing your SEO content...",
       minHeight: 400,
       buttons: [
         "bold",
         "italic",
         "underline",
         "strikethrough",
         "|",
         "h1",
         "h2",
         "h3",
         "h4",
         "h5",
         "h6",
         "|",
         {
           name: "ul",
           tooltip: "Insert Unordered List",
           icon: "ul",
           list: {
             disc: "Disc",
             circle: "Circle",
             square: "Square",
           },
           exec: (editor: Jodit, event: any, { control }: any) => {
             const style = control.args ? control.args[0] : "disc";
             editor.execCommand("insertUnorderedList");
             const ul = editor.selection.getNode()?.closest("ul");
             if (ul) {
               ul.style.listStyleType = style;
             }
           },
         },
         {
           name: "ol",
           tooltip: "Insert Ordered List",
           icon: "ol",
           list: {
             decimal: "Numbers",
             "upper-roman": "Upper Roman",
             "lower-alpha": "Lower Alpha",
             "lower-roman": "Lower Roman",
             "upper-alpha": "Upper Alpha",
           },
           exec: (editor: Jodit, event: any, { control }: any) => {
             const style = control.args ? control.args[0] : "decimal";
             editor.execCommand("insertOrderedList");
             const ol = editor.selection.getNode()?.closest("ol");
             if (ol) {
               ol.style.listStyleType = style;
             }
           },
         },
         "|",
         "link",
         "image",
         {
           name: "table",
           tooltip: "Insert Table",
           icon: "table",
           popup: (editor: Jodit) => {
             return editor.create.inside.element("div", {
               class: "jodit_popup_table",
               innerHTML: `
                 <div>
                   <label>Rows: <input type="number" min="1" value="2" class="jodit_table_rows"></label>
                   <label>Cols: <input type="number" min="1" value="2" class="jodit_table_cols"></label>
                   <button type="button" class="jodit_table_insert">Insert</button>
                 </div>
               `,
             });
           },
           exec: (editor: Jodit, event: any, { control }: any) => {
             const popup = control.control.popup;
             const rowsInput = popup.querySelector(".jodit_table_rows") as HTMLInputElement;
             const colsInput = popup.querySelector(".jodit_table_cols") as HTMLInputElement;
             const insertButton = popup.querySelector(".jodit_table_insert") as HTMLButtonElement;
             insertButton.onclick = () => {
               const rows = parseInt(rowsInput.value) || 2;
               const cols = parseInt(colsInput.value) || 2;
               const table = editor.create.inside.element("table");
               for (let i = 0; i < rows; i++) {
                 const tr = editor.create.inside.element("tr");
                 for (let j = 0; j < cols; j++) {
                   const td = editor.create.inside.element("td");
                   td.innerHTML = "&nbsp;";
                   tr.appendChild(td);
                 }
                 table.appendChild(tr);
               }
               editor.selection.insertNode(table);
               console.log("Table inserted:", table.outerHTML);
             };
           },
         },
         "|",
         "undo",
         "redo",
         "|",
         "align",
         "font",
         "fontsize",
         "|",
         "source",
         "fullsize",
       ],
       enableDragAndDropFileToEditor: true,
       copyFormat: true,
       pasteFromWord: true,
       pasteFromWordClean: true,
       askBeforePasteHTML: false,
       askBeforePasteFromWord: false,
       defaultActionOnPaste: "insert_as_html",
       pastePlain: false,
       cleanHTML: {
         cleanOnPaste: false,
         removeEmptyElements: false,
         fillEmptyParagraph: false,
         replaceOldTags: false,
         cleanWordHTML: true,
         allowTags: {
           p: { class: true, style: true },
           div: { class: true, style: true },
           span: { class: true, style: true },
           ul: { "list-style-type": true, class: true, style: true },
           ol: { "list-style-type": true, class: true, style: true },
           li: { class: true, style: true },
           b: true,
           strong: true,
           i: true,
           em: true,
           a: { href: true, target: true, rel: true },
           img: { src: true, alt: true, class: true, style: true },
           h1: { class: true, style: true },
           h2: { class: true, style: true },
           h3: { class: true, style: true },
           h4: { class: true, style: true },
           h5: { class: true, style: true },
           h6: { class: true, style: true },
           table: { class: true, style: true, border: true, cellpadding: true, cellspacing: true },
           tr: { class: true, style: true },
           td: { class: true, style: true, colspan: true, rowspan: true },
           th: { class: true, style: true, colspan: true, rowspan: true },
           tbody: { class: true, style: true },
           thead: { class: true, style: true },
           tfoot: { class: true, style: true },
           caption: { class: true, style: true },
           blockquote: { class: true, style: true },
           br: true,
         },
         denyTags: ["script", "style", "meta", "o:p", "w:sdtdoc"],
         cleanAttributes: [], // Disable attribute cleaning to preserve table attributes
       },
       clipboard: {
         useNativeClipboard: true,
         cleanPastedHTML: false,
       },
       disablePlugins: [], // Ensure table plugin is not disabled
       table: {
         allowResize: true,
         allowMerge: true,
         allowSplit: true,
       },
       uploader: {
         insertImageAsBase64URI: true,
         imagesExtensions: ["jpg", "png", "jpeg", "gif"],
       },
       style: {
         fontFamily: "Arial, sans-serif",
       },
       events: {
         afterInit: (editor: Jodit) => {
           console.log("JoditEditor initialized with content:", editor.getEditorValue());
         },
         change: (newContent: string) => {
           console.log("Editor content changed:", newContent);
         },
         focus: () => {
           console.log("Editor focused, current content:", editor.current?.getEditorValue());
         },
         afterInsertNode: (node: Node) => {
           console.log("Node inserted:", node.outerHTML || node.textContent);
         },
       },
     }),
     []
   );

  // Fetch pincode and area data
  useEffect(() => {
    const fetchPincodeInfo = async () => {
      setIsLoading(true);
      try {
        const res = await getAllPincodes();
        if (res.success && Array.isArray(res.data)) {
          setPincodeData(res.data);
        } else {
          setError("Failed to fetch pincodes");
        }
      } catch (err) {
        setError("Error fetching pincodes");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPincodeInfo();
  }, []);

  // Pre-populate form with passed searchContent data
  useEffect(() => {
    if (!searchContent || categories.length === 0) return;

    const category = categories.find((cat) => cat._id === searchContent.categoryId);
    const initialSeoContent = searchContent.seo_content || "";
    setFormData({
      categoryId: searchContent.categoryId || "",
      areaName: searchContent.areaName || "",
      city: searchContent.city || "",
      state: searchContent.state || "",
      pincode: searchContent.pincode || "",
      metaTitle: searchContent.meta_title || "",
      metaDescription: searchContent.meta_description || "",
      seoContent: initialSeoContent,
    });
    setSelectedCity(searchContent.city || "Hyderabad");
    setSelectedState(searchContent.state || "Telangana");
    setSelectedArea(searchContent.areaName || "");
    setSelectedPincode(searchContent.pincode || "");
    setSelectedSubArea("");
    setSelectedCategory(
      category
        ? {
            name: category.category_name,
            slug: category.category_slug,
            id: category._id,
          }
        : { name: "", slug: "", id: "" }
    );
    console.log("Initial SEO content loaded:", initialSeoContent);
  }, [searchContent, categories]);

  // Compute area options
  const computedAreaOptions = useMemo(() => {
    return pincodeData
      .flatMap((p) =>
        p.areas.map((area) => ({
          ...area,
          pincode: p.code,
          state: p.state,
          city: p.city,
        }))
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [pincodeData]);

  // Update subarea options when area changes
  useEffect(() => {
    setAreaOptions(computedAreaOptions);
    if (selectedArea) {
      const matchedPincodeObj = pincodeData.find((p) =>
        p.areas.some((a) => a.name === selectedArea)
      );
      if (matchedPincodeObj) {
        const matchedArea = matchedPincodeObj.areas.find((a) => a.name === selectedArea);
        const subAreas = matchedArea?.subAreas || [];
        setSubAreaOptions([...subAreas].sort((a, b) => a.name.localeCompare(b.name)));
      } else {
        setSubAreaOptions([]);
      }
    } else {
      setSubAreaOptions([]);
    }
  }, [selectedArea, computedAreaOptions]);

  // Handle area selection
  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const areaName = e.target.value;
    setSelectedArea(areaName);

    if (areaName) {
      const matchedPincodeObj = pincodeData.find((p) =>
        p.areas.some((a) => a.name === areaName)
      );
      if (matchedPincodeObj) {
        setSelectedPincode(matchedPincodeObj.code);
        setSelectedState(matchedPincodeObj.state);
        setSelectedCity(matchedPincodeObj.city);
        setFormData((prev) => ({
          ...prev,
          areaName,
          city: matchedPincodeObj.city,
          state: matchedPincodeObj.state,
          pincode: matchedPincodeObj.code,
        }));
      }
    } else {
      setSelectedPincode("");
      setSelectedState("");
      setSelectedCity("");
      setSubAreaOptions([]);
      setSelectedSubArea("");
      setFormData((prev) => ({
        ...prev,
        areaName: "",
        city: "",
        state: "",
        pincode: "",
      }));
    }
  };

  // Handle category selection
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = e.target.selectedIndex - 1;
    if (index >= 0 && categories[index]) {
      const cat = categories[index];
      setSelectedCategory({
        name: cat.category_name,
        slug: cat.category_slug,
        id: cat._id,
      });
      setFormData((prev) => ({
        ...prev,
        categoryId: cat._id,
      }));
    } else {
      setSelectedCategory({ name: "", slug: "", id: "" });
      setFormData((prev) => ({
        ...prev,
        categoryId: "",
      }));
    }
  };

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle SEO content changes
  const handleSeoContentChange = (newContent: string) => {
    setFormData((prev) => ({
      ...prev,
      seoContent: newContent,
    }));
    console.log("SEO content updated:", newContent);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!searchContent) {
      setError("No search content data provided");
      return;
    }

    if (
      !formData.categoryId ||
      !formData.metaTitle ||
      !formData.metaDescription ||
      !formData.seoContent
    ) {
      setError("Please fill all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const requestData = {
        searchContentDataId: searchContent.id,
        categoryId: formData.categoryId,
        areaName: selectedArea,
        city: selectedCity,
        state: selectedState,
        pincode: selectedPincode,
        meta_title: formData.metaTitle,
        meta_description: formData.metaDescription,
        seo_content: formData.seoContent,
      };

      const response = await updateCagegorySearchDetails(requestData);
      if (response?.success) {
        alert("Meta Info updated successfully!");
        navigate(-1);
      } else {
        throw new Error(response?.message || "Failed to update meta info");
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error?.message || "An error occurred. Please try again later.";
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form reset
  const handleReset = () => {
    if (!searchContent) return;
    const category = categories.find((cat) => cat._id === searchContent.categoryId);
    const initialSeoContent = searchContent.seo_content || "";
    setFormData({
      categoryId: searchContent.categoryId || "",
      areaName: searchContent.areaName || "",
      city: searchContent.city || "",
      state: searchContent.state || "",
      pincode: searchContent.pincode || "",
      metaTitle: searchContent.meta_title || "",
      metaDescription: searchContent.meta_description || "",
      seoContent: initialSeoContent,
    });
    setSelectedCity(searchContent.city || "Hyderabad");
    setSelectedState(searchContent.state || "Telangana");
    setSelectedArea(searchContent.areaName || "");
    setSelectedPincode(searchContent.pincode || "");
    setSelectedSubArea("");
    setSelectedCategory(
      category
        ? {
            name: category.category_name,
            slug: category.category_slug,
            id: category._id,
          }
        : { name: "", slug: "", id: "" }
    );
    setError(null);
    console.log("Form reset, SEO content restored:", initialSeoContent);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Edit Meta Info
            </h1>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            disabled={isLoading}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
        </div>

        {isLoading && <div className="text-gray-500 mb-4">Loading...</div>}
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {categoriesLoading && <div className="text-gray-500 mb-4">Loading categories...</div>}
        {categoriesError && <div className="text-red-500 mb-4">{categoriesError}</div>}
        {!searchContent && <div className="text-red-500 mb-4">No search content data provided</div>}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Search Selection Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">Search Selection</h2>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category Dropdown */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    value={selectedCategory.name}
                    onChange={handleCategoryChange}
                    required
                    disabled={isLoading || categoriesLoading}
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    {categories
                      // .filter((cat) => cat.status === 1)
                      .sort((a, b) => a.category_name.toLowerCase().localeCompare(b.category_name.toLowerCase()))
                      .map((cat) => (
                        <option key={cat._id} value={cat.category_name}>
                          {cat.category_name}
                        </option>
                      ))}
                  </select>
                  <BiSolidCategory
                    className="absolute left-3 top-[38px] text-blue-400"
                    size={20}
                  />
                </div>

                {/* City Dropdown */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    required
                    disabled={isLoading}
                  >
                    <option value="" disabled>
                      Select City
                    </option>
                    {cityOptions.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  <MapPin className="absolute left-3 top-[38px] text-blue-400" size={20} />
                </div>

                {/* Area Dropdown */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area 
                  </label>
                  <select
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    value={selectedArea}
                    onChange={handleAreaChange}
                    // required
                    disabled={isLoading || !areaOptions.length}
                  >
                    <option value="" disabled>
                      Select Area
                    </option>
                    {areaOptions.map((area) => (
                      <option key={`${area.name}-${area.pincode}`} value={area.name}>
                        {area.name} - {area.pincode}
                      </option>
                    ))}
                  </select>
                  <MapPin className="absolute left-3 top-[38px] text-blue-400" size={20} />
                </div>

                {/* Subarea Dropdown */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subarea
                  </label>
                  <select
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    value={selectedSubArea}
                    onChange={(e) => setSelectedSubArea(e.target.value)}
                    disabled={isLoading || !subAreaOptions.length}
                  >
                    <option value="" disabled>
                      {subAreaOptions.length ? "Select Subarea" : "No subareas available"}
                    </option>
                    {subAreaOptions.map((sub, idx) => (
                      <option key={sub._id || `sub-${idx}`} value={sub.name}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                  <MapPin className="absolute left-3 top-[38px] text-blue-400" size={20} />
                </div>
              </div>
            </div>
          </div>

          {/* Meta Information */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">Meta Information</h2>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Meta Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter meta title"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Meta Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter meta description"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* SEO Content */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-blue-600 mb-4">SEO Content</h2>
            <JoditEditor
              ref={editor}
              value={formData.seoContent}
              config={config}
              onChange={handleSeoContentChange}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto flex items-center gap-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
                disabled={isLoading || !searchContent}
              >
                <RefreshCw className="h-5 w-5" />
                Reset
              </button>
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
              disabled={isLoading || !searchContent}
            >
              {isLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMetaInfo;
// import React, { useState, useEffect, useRef, useMemo } from "react";
// import { ArrowLeft, BookOpen, MapPin, RefreshCw } from "lucide-react";
// import { BiSolidCategory } from "react-icons/bi";
// import { useLocation, useNavigate } from "react-router-dom";
// import { getAllPincodes, updateCagegorySearchDetails } from "../../api/apiMethods";
// import { useCategoryContext } from "../Context/CategoryContext";
// import JoditEditor from "jodit-react";

// interface SearchContent {
//   id: string;
//   categoryId: string;
//   categoryName: string;
//   areaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   meta_title: string;
//   meta_description: string;
//   seo_content: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface Category {
//   _id: string;
//   category_name: string;
//   category_image: string | null;
//   category_slug: string;
//   meta_title: string;
//   meta_description: string;
//   status: number;
// }

// const EditMetaInfo: React.FC = () => {
//   const location = useLocation();
//   const searchContent = location?.state?.content as SearchContent;
//   const { categories, loading: categoriesLoading, error: categoriesError } = useCategoryContext();
//   const navigate = useNavigate();
//     const editor = useRef(null);

//   // States for dropdowns
//   const [pincodeData, setPincodeData] = useState([]);
//   const [areaOptions, setAreaOptions] = useState([]);
//   const [subAreaOptions, setSubAreaOptions] = useState([]);

//   // Selected values
//   const [selectedCity, setSelectedCity] = useState("");
//   const [selectedState, setSelectedState] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState({
//     name: "",
//     slug: "",
//     id: "",
//   });
//   const [selectedArea, setSelectedArea] = useState("");
//   const [selectedPincode, setSelectedPincode] = useState("");
//   const [selectedSubArea, setSelectedSubArea] = useState("");

//   const [formData, setFormData] = useState({
//     categoryId: "",
//     areaName: "",
//     city: "",
//     state: "",
//     pincode: "",
//     metaTitle: "",
//     metaDescription: "",
//     seoContent: "",
//   });

//   const [error, setError] = useState<string | null>(null);
//   const cityOptions = ["Hyderabad"];

//   // Debug searchContent on mount
//   useEffect(() => {
//     console.log("searchContent:", searchContent);
//   }, [searchContent]);

//   // Fetch pincode and area data
//   useEffect(() => {
//     const fetchPincodeInfo = async () => {
//       try {
//         const res = await getAllPincodes();
//         if (res.success && Array.isArray(res.data)) {
//           setPincodeData(res.data);
//         } else {
//           setError("Failed to fetch pincodes");
//         }
//       } catch (err) {
//         setError("Error fetching pincodes");
//       }
//     };
//     fetchPincodeInfo();
//   }, []);

//   // Pre-populate form with passed searchContent data
//   useEffect(() => {
//     if (searchContent && categories.length > 0) {
//       setFormData({
//         categoryId: searchContent.categoryId || "",
//         areaName: searchContent.areaName || "",
//         city: searchContent.city || "",
//         state: searchContent.state || "",
//         pincode: searchContent.pincode || "",
//         metaTitle: searchContent.meta_title || "",
//         metaDescription: searchContent.meta_description || "",
//         seoContent: searchContent.seo_content || "",
//       });
//       setSelectedCity(searchContent.city || "Hyderabad");
//       setSelectedState(searchContent.state || "Telangana");
//       setSelectedArea(searchContent.areaName || "");
//       setSelectedPincode(searchContent.pincode || "");

//       // Set selected category
//       const category = categories.find((cat) => cat._id === searchContent.categoryId);
//       if (category) {
//         setSelectedCategory({
//           name: category.category_name,
//           slug: category.category_slug,
//           id: category._id,
//         });
//       } else {
//         console.log("Category not found for categoryId:", searchContent.categoryId);
//         setSelectedCategory({ name: "", slug: "", id: "" });
//       }
//     }
//   }, [searchContent, categories]);

//   // Update area options when pincodeData or selectedArea changes
//   useEffect(() => {
//     const flattenedAreas = pincodeData.flatMap((p) =>
//       p.areas.map((area) => ({
//         ...area,
//         pincode: p.code,
//         state: p.state,
//         city: p.city,
//       }))
//     );
//     setAreaOptions(flattenedAreas);

//     // Set subareas based on selected area
//     if (selectedArea) {
//       const matchedPincodeObj = pincodeData.find((p) =>
//         p.areas.some((a) => a.name === selectedArea)
//       );
//       if (matchedPincodeObj) {
//         const matchedArea = matchedPincodeObj.areas.find(
//           (a) => a.name === selectedArea
//         );
//         const subAreas = matchedArea?.subAreas || [];
//         setSubAreaOptions(
//           [...subAreas].sort((a, b) => a.name.localeCompare(b.name))
//         );
//       } else {
//         setSubAreaOptions([]);
//       }
//     }
//   }, [pincodeData, selectedArea]);

//   // Handle area selection and update subareas
//   const handleAreaChange = (e) => {
//     const areaName = e.target.value;
//     setSelectedArea(areaName);

//     const matchedPincodeObj = pincodeData.find((p) =>
//       p.areas.some((a) => a.name === areaName)
//     );

//     if (matchedPincodeObj) {
//       setSelectedPincode(matchedPincodeObj.code);
//       setSelectedState(matchedPincodeObj.state);
//       setSelectedCity(matchedPincodeObj.city);

//       const matchedArea = matchedPincodeObj.areas.find(
//         (a) => a.name === areaName
//       );
//       const subAreas = matchedArea?.subAreas || [];
//       setSubAreaOptions(
//         [...subAreas].sort((a, b) => a.name.localeCompare(b.name))
//       );
//       setSelectedSubArea("");
//     } else {
//       setSelectedPincode("");
//       setSubAreaOptions([]);
//       setSelectedSubArea("");
//     }

//     setFormData((prev) => ({
//       ...prev,
//       areaName,
//       city: matchedPincodeObj?.city || "",
//       state: matchedPincodeObj?.state || "",
//       pincode: matchedPincodeObj?.code || "",
//     }));
//   };

//   const handleCategoryChange = (e) => {
//     const index = e.target.selectedIndex - 1;
//     if (index >= 0) {
//       const cat = categories[index];
//       setSelectedCategory({
//         name: cat.category_name,
//         slug: cat.category_slug,
//         id: cat._id,
//       });
//       setFormData((prev) => ({
//         ...prev,
//         categoryId: cat._id,
//       }));
//     } else {
//       setSelectedCategory({ name: "", slug: "", id: "" });
//       setFormData((prev) => ({
//         ...prev,
//         categoryId: "",
//       }));
//     }
//   };

//   const handleInputChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSeoContentChange = (value: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       seoContent: value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     try {
//       if (
//         !formData.categoryId ||
//         !selectedArea ||
//         !selectedPincode ||
//         !formData.metaTitle ||
//         !formData.metaDescription ||
//         !formData.seoContent
//       ) {
//         setError("Please fill all required fields");
//         return;
//       }

//       const requestData = {
//         searchContentDataId: searchContent?.id,
//         categoryId: formData.categoryId,
//         areaName: selectedArea,
//         city: selectedCity,
//         state: selectedState,
//         pincode: selectedPincode,
//         meta_title: formData.metaTitle,
//         meta_description: formData.metaDescription,
//         seo_content: formData.seoContent,
//       };

//       const response = await updateCagegorySearchDetails(requestData);

//       if (response?.success) {
//         alert("Meta Info updated successfully!");
//         navigate(-1);
//       } else {
//         throw new Error(response?.message || "Failed to update meta info");
//       }
//     } catch (error: any) {
//       console.error("Error updating meta info:", error);
//       const errorMessage =
//         error?.response?.data?.message ||
//         error?.message ||
//         "An error occurred. Please try again later.";
//       setError(errorMessage);
//       alert(errorMessage);
//     }
//   };

//   const handleReset = () => {
//     if (searchContent) {
//       setFormData({
//         categoryId: searchContent.categoryId || "",
//         areaName: searchContent.areaName || "",
//         city: searchContent.city || "",
//         state: searchContent.state || "",
//         pincode: searchContent.pincode || "",
//         metaTitle: searchContent.meta_title || "",
//         metaDescription: searchContent.meta_description || "",
//         seoContent: searchContent.seo_content || "",
//       });
//       setSelectedCity(searchContent.city || "Hyderabad");
//       setSelectedState(searchContent.state || "Telangana");
//       setSelectedArea(searchContent.areaName || "");
//       setSelectedPincode(searchContent.pincode || "");
//       setSelectedSubArea("");
//       const category = categories.find((cat) => cat._id === searchContent.categoryId);
//       if (category) {
//         setSelectedCategory({
//           name: category.category_name,
//           slug: category.category_slug,
//           id: category._id,
//         });
//       } else {
//         setSelectedCategory({ name: "", slug: "", id: "" });
//       }
//     }
//     setError(null);
//   };

//   // // JoditEditor configuration
//   //   const config = {
//   //   readonly: false,
//   //   placeholder: "Start typing your SEO content...",
//   //   minHeight: 300,
//   //   buttons: [
//   //     "bold",
//   //     "italic",
//   //     "underline",
//   //     "|",
//   //     "ul",
//   //     "ol",
//   //     "|",
//   //     "link",
//   //     "table",
//   //     "|",
//   //     "undo",
//   //     "redo",
//   //     "|",
//   //     "source",
//   //     "fullsize",
//   //   ],
//   //   enableDragAndDropFileToEditor: true,
//   //   copyFormat: true,
//   //   pasteFromWord: true,
//   //   uploader: { insertImageAsBase64URI: true },
//   //   style: {
//   //     fontFamily: "Arial, sans-serif",
//   //   },
//   // };

//     const config = {
//   readonly: false,
//   placeholder: "Start typing your SEO content...",
//   minHeight: 400,
//   buttons: [
//     "bold",
//     "italic",
//     "underline",
//     "strikethrough",
//     "|",
//     "h1",
//     "h2",
//     "h3",
//     "|",
//     {
//       name: "ul",
//       tooltip: "Insert Unordered List",
//       icon: "ul",
//       list: {
//         disc: "Disc",
//         circle: "Circle",
//         square: "Square",
//       },
//       exec: (editor, event, { control }) => {
//         const style = control.args ? control.args[0] : "disc";
//         editor.execCommand("insertUnorderedList");
//         const ul = editor.selection.getNode()?.closest("ul");
//         if (ul) {
//           ul.style.listStyleType = style;
//           console.log(`Applied UL style: ${style}, HTML: ${ul.outerHTML}`);
//         } else {
//           console.warn("No UL found after inserting unordered list");
//         }
//       },
//     },
//     {
//       name: "ol",
//       tooltip: "Insert Ordered List",
//       icon: "ol",
//       list: {
//         decimal: "Numbers",
//         "upper-roman": "Upper Roman",
//         "lower-alpha": "Lower Alpha",
//         "lower-roman": "Lower Roman",
//         "upper-alpha": "Upper Alpha",
//       },
//       exec: (editor, event, { control }) => {
//         const style = control.args ? control.args[0] : "decimal";
//         editor.execCommand("insertOrderedList");
//         const ol = editor.selection.getNode()?.closest("ol");
//         if (ol) {
//           ol.style.listStyleType = style;
//           console.log(`Applied OL style: ${style}, HTML: ${ol.outerHTML}`);
//         } else {
//           console.warn("No OL found after inserting ordered list");
//         }
//       },
//     },
//     "|",
//     "link",
//     "image",
//     "table",
//     "|",
//     "undo",
//     "redo",
//     "|",
//     "align",
//     "font",
//     "fontsize",
//     "|",
//     "source",
//     "fullsize",
//   ],
//   enableDragAndDropFileToEditor: true,
//   copyFormat: true,
//   pasteFromWord: true,
//   pasteFromWordClean: true,
//   askBeforePasteHTML: false,
//   askBeforePasteFromWord: false,
//   defaultActionOnPaste: "insert_as_html",
//   pastePlain: false,
//   cleanHTML: {
//     cleanOnPaste: true,
//     removeEmptyElements: false,
//     fillEmptyParagraph: false,
//     replaceOldTags: true,
//     cleanWordHTML: true,
//     allowTags: {
//       ul: { "list-style-type": true, class: true, style: true },
//       ol: { "list-style-type": true, class: true, style: true },
//       li: { class: true, style: true },
//       p: { class: true, style: true },
//       span: { class: true, style: true },
//       div: { class: true, style: true },
//       b: true,
//       strong: true,
//       i: true,
//       em: true,
//       a: { href: true, target: true },
//       img: { src: true, alt: true },
//     },
//     denyTags: ["script", "style", "meta", "o:p", "w:sdtdoc"],
//     cleanAttributes: ["data-*", "id"],
//   },
//   clipboard: {
//     useNativeClipboard: true,
//     cleanPastedHTML: true,
//   },
//   uploader: {
//     insertImageAsBase64URI: true,
//     imagesExtensions: ["jpg", "png", "jpeg", "gif"],
//   },
//   style: {
//     fontFamily: "Arial, sans-serif",
//   },
// };


//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
//               <BookOpen className="h-6 w-6 text-white" />
//             </div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//               Edit Meta Info
//             </h1>
//           </div>
//           <button
//             onClick={() => navigate(-1)}
//             className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-8">
//           {/* Search Selection Section */}
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//               <h2 className="text-lg font-semibold text-white">
//                 Search Selection
//               </h2>
//             </div>

//             <div className="p-6 space-y-6">
//               {error && <div className="text-red-500 mb-4">{error}</div>}
//               {categoriesLoading && <div className="text-gray-500 mb-4">Loading categories...</div>}
//               {categoriesError && <div className="text-red-500 mb-4">{categoriesError}</div>}
//               {!searchContent && <div className="text-red-500 mb-4">No search content data provided</div>}

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Category Dropdown */}
//                 <div className="relative">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Category <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
//                     value={selectedCategory.name}
//                     onChange={handleCategoryChange}
//                     required
//                   >
//                     <option value="" disabled>
//                       Select Category
//                     </option>
//                     {categories
//                       .filter((cat) => cat.status === 1)
//                       .sort((a, b) => a.category_name.toLowerCase().localeCompare(b.category_name.toLowerCase()))
//                       .map((cat, idx) => (
//                         <option key={idx} value={cat.category_name}>
//                           {cat.category_name}
//                         </option>
//                       ))}
//                   </select>
//                   <BiSolidCategory
//                     className="absolute left-3 top-[38px] text-blue-400"
//                     size={20}
//                   />
//                 </div>

//                 {/* City Dropdown */}
//                 <div className="relative">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     City <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
//                     value={selectedCity}
//                     onChange={(e) => setSelectedCity(e.target.value)}
//                     required
//                   >
//                     <option value="" disabled>
//                       Select City
//                     </option>
//                     {cityOptions.map((city, idx) => (
//                       <option key={idx} value={city}>
//                         {city}
//                       </option>
//                     ))}
//                   </select>
//                   <MapPin
//                     className="absolute left-3 top-[38px] text-blue-400"
//                     size={20}
//                   />
//                 </div>

//                 {/* Area Dropdown */}
//                 <div className="relative">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Area <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
//                     value={selectedArea}
//                     onChange={handleAreaChange}
//                     required
//                   >
//                     <option value="" disabled>
//                       Select Area
//                     </option>
//                     {areaOptions
//                       .sort((a, b) => a.name.localeCompare(b.name))
//                       .map((area, idx) => (
//                         <option key={idx} value={area.name}>
//                           {area.name} - {area.pincode}
//                         </option>
//                       ))}
//                   </select>
//                   <MapPin
//                     className="absolute left-3 top-[38px] text-blue-400"
//                     size={20}
//                   />
//                 </div>

//                 {/* Subarea Dropdown */}
//                 <div className="relative">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Subarea
//                   </label>
//                   <select
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
//                     value={selectedSubArea}
//                     onChange={(e) => setSelectedSubArea(e.target.value)}
//                     disabled={!subAreaOptions.length}
//                   >
//                     <option value="" disabled>
//                       Select Subarea
//                     </option>
//                     {subAreaOptions.map((sub, idx) => (
//                       <option key={sub._id || idx} value={sub.name}>
//                         {sub.name}
//                       </option>
//                     ))}
//                   </select>
//                   <MapPin
//                     className="absolute left-3 top-[38px] text-blue-400"
//                     size={20}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Meta Information */}
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//               <h2 className="text-lg font-semibold text-white">
//                 Meta Information
//               </h2>
//             </div>

//             <div className="p-6 space-y-6">
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Meta Title <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="metaTitle"
//                   value={formData.metaTitle}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                   placeholder="Enter meta title"
//                   required
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Meta Description <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   name="metaDescription"
//                   value={formData.metaDescription}
//                   onChange={handleInputChange}
//                   rows={3}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                   placeholder="Enter meta description"
//                   required
//                 />
//               </div>
//             </div>
//           </div>

//           {/* SEO Content */}
//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <h2 className="text-lg font-semibold text-blue-600 mb-4">
//               SEO Content
//             </h2>
//             <JoditEditor
//                   ref={editor}
//                   value={formData.seoContent}
//                   config={config}
//                   onBlur={handleSeoContentChange}
//                   onChange={(newContent) => {}}
//                 />
//           </div>

//           {/* Action Buttons */}
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//             <div className="flex gap-3 w-full sm:w-auto">
//               <button
//                 type="button"
//                 onClick={handleReset}
//                 className="w-full sm:w-auto flex items-center gap-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
//               >
//                 <RefreshCw className="h-5 w-5" />
//                 Reset
//               </button>
//             </div>
//             <button
//               type="submit"
//               className="w-full sm:w-auto flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
//             >
//               Update
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditMetaInfo;
// import React, { useState, useEffect } from "react";
// import { ArrowLeft, BookOpen, MapPin, RefreshCw } from "lucide-react";
// import { BiSolidCategory } from "react-icons/bi";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import { useLocation, useNavigate } from "react-router-dom";
// import { getAllPincodes, updateCagegorySearchDetails, } from "../../api/apiMethods"; // Adjust path as needed
// import { useCategoryContext } from "../Context/CategoryContext";

// interface SearchContent {
//   id: string;
//   categoryId: string;
//   categoryName: string;
//   areaName: string;
//   city: string;
//   state: string;
//   pincode: string;
//   meta_title: string;
//   meta_description: string;
//   seo_content: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface EditMetaInfoProps {
//   state: {
//     searchContent: SearchContent;
//   };
// }

// interface Category {
//   _id: string;
//   category_name: string;
//   category_image: string | null;
//   category_slug: string;
//   meta_title: string;
//   meta_description: string;
//   status: number;
// }

// const EditMetaInfo: React.FC<EditMetaInfoProps> = ({ state }) => {
//   const location = useLocation();
//   const searchContent = location.state?.searchContent as SearchContent | undefined;
//   const { categories, loading: categoriesLoading, error: categoriesError } = useCategoryContext();
//   const navigate = useNavigate();

//   // States for dropdowns
//   const [pincodeData, setPincodeData] = useState([]);
//   const [areaOptions, setAreaOptions] = useState([]);
//   const [subAreaOptions, setSubAreaOptions] = useState([]);

//   // Selected values
//   const [selectedCity, setSelectedCity] = useState("");
//   const [selectedState, setSelectedState] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState({
//     name: "",
//     slug: "",
//     id: "",
//   });
//   const [selectedArea, setSelectedArea] = useState("");
//   const [selectedPincode, setSelectedPincode] = useState("");
//   const [selectedSubArea, setSelectedSubArea] = useState("");

//   const [formData, setFormData] = useState({
//     categoryId: "",
//     areaName: "",
//     city: "",
//     state: "",
//     pincode: "",
//     metaTitle: "",
//     metaDescription: "",
//     seoContent: "",
//   });

//   const [error, setError] = useState<string | null>(null);
//   const cityOptions = ["Hyderabad"];

//   // Fetch pincode and area data
//   useEffect(() => {
//     const fetchPincodeInfo = async () => {
//       try {
//         const res = await getAllPincodes();
//         if (res.success && Array.isArray(res.data)) {
//           setPincodeData(res.data);
//         } else {
//           setError("Failed to fetch pincodes");
//         }
//       } catch (err) {
//         setError("Error fetching pincodes");
//       }
//     };
//     fetchPincodeInfo();
//   }, []);

//   // Pre-populate form with passed searchContent data
//   useEffect(() => {
//     if (searchContent) {
//       setFormData({
//         categoryId: searchContent.categoryId || "",
//         areaName: searchContent.areaName || "",
//         city: searchContent.city || "",
//         state: searchContent.state || "",
//         pincode: searchContent.pincode || "",
//         metaTitle: searchContent.meta_title || "",
//         metaDescription: searchContent.meta_description || "",
//         seoContent: searchContent.seo_content || "",
//       });
//       setSelectedCity(searchContent.city || "Hyderabad");
//       setSelectedState(searchContent.state || "Telangana");
//       setSelectedArea(searchContent.areaName || "");
//       setSelectedPincode(searchContent.pincode || "");

//       // Set selected category
//       const category = categories.find((cat) => cat._id === searchContent.categoryId);
//       if (category) {
//         setSelectedCategory({
//           name: category.category_name,
//           slug: category.category_slug,
//           id: category._id,
//         });
//       }
//     }
//   }, [searchContent, categories]);

//   // Update area options when pincodeData is available
//   useEffect(() => {
//     const flattenedAreas = pincodeData.flatMap((p) =>
//       p.areas.map((area) => ({
//         ...area,
//         pincode: p.code,
//         state: p.state,
//         city: p.city,
//       }))
//     );
//     setAreaOptions(flattenedAreas);

//     // Set subareas based on selected area
//     if (selectedArea) {
//       const matchedPincodeObj = pincodeData.find((p) =>
//         p.areas.some((a) => a.name === selectedArea)
//       );
//       if (matchedPincodeObj) {
//         const matchedArea = matchedPincodeObj.areas.find(
//           (a) => a.name === selectedArea
//         );
//         const subAreas = matchedArea?.subAreas || [];
//         setSubAreaOptions(
//           [...subAreas].sort((a, b) => a.name.localeCompare(b.name))
//         );
//       }
//     }
//   }, [pincodeData, selectedArea]);

//   // Handle area selection and update subareas
//   const handleAreaChange = (e) => {
//     const areaName = e.target.value;
//     setSelectedArea(areaName);

//     const matchedPincodeObj = pincodeData.find((p) =>
//       p.areas.some((a) => a.name === areaName)
//     );

//     if (matchedPincodeObj) {
//       setSelectedPincode(matchedPincodeObj.code);
//       setSelectedState(matchedPincodeObj.state);
//       setSelectedCity(matchedPincodeObj.city);

//       const matchedArea = matchedPincodeObj.areas.find(
//         (a) => a.name === areaName
//       );
//       const subAreas = matchedArea?.subAreas || glazing;
//       setSubAreaOptions(
//         [...subAreas].sort((a, b) => a.name.localeCompare(b.name))
//       );
//       setSelectedSubArea("");
//     } else {
//       setSelectedPincode("");
//       setSubAreaOptions([]);
//       setSelectedSubArea("");
//     }

//     setFormData((prev) => ({
//       ...prev,
//       areaName,
//       city: matchedPincodeObj?.city || "",
//       state: matchedPincodeObj?.state || "",
//       pincode: matchedPincodeObj?.code || "",
//     }));
//   };

//   const handleCategoryChange = (e) => {
//     const index = e.target.selectedIndex - 1;
//     if (index >= 0) {
//       const cat = categories[index];
//       setSelectedCategory({
//         name: cat.category_name,
//         slug: cat.category_slug,
//         id: cat._id,
//       });
//       setFormData((prev) => ({
//         ...prev,
//         categoryId: cat._id,
//       }));
//     } else {
//       setSelectedCategory({ name: "", slug: "", id: "" });
//       setFormData((prev) => ({
//         ...prev,
//         categoryId: "",
//       }));
//     }
//   };

//   const handleInputChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSeoContentChange = (value: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       seoContent: value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     try {
//       if (
//         !formData.categoryId ||
//         !selectedArea ||
//         !selectedPincode ||
//         !formData.metaTitle ||
//         !formData.metaDescription ||
//         !formData.seoContent
//       ) {
//         setError("Please fill all required fields");
//         return;
//       }

//       const requestData = {
//         searchContentDataId: searchContent?.id,
//         categoryId: formData.categoryId,
//         areaName: selectedArea,
//         city: selectedCity,
//         state: selectedState,
//         pincode: selectedPincode,
//         meta_title: formData.metaTitle,
//         meta_description: formData.metaDescription,
//         seo_content: formData.seoContent,
//       };

//       const response = await updateCagegorySearchDetails(requestData);

//       if (response?.success) {
//         alert("Meta Info updated successfully!");
//         navigate(-1);
//       } else {
//         throw new Error(response?.message || "Failed to update meta info");
//       }
//     } catch (error: any) {
//       console.error("Error updating meta info:", error);
//       const errorMessage =
//         error?.response?.data?.message ||
//         error?.message ||
//         "An error occurred. Please try again later.";
//       setError(errorMessage);
//       alert(errorMessage);
//     }
//   };

//   const handleReset = () => {
//     if (searchContent) {
//       setFormData({
//         categoryId: searchContent.categoryId || "",
//         areaName: searchContent.areaName || "",
//         city: searchContent.city || "",
//         state: searchContent.state || "",
//         pincode: searchContent.pincode || "",
//         metaTitle: searchContent.meta_title || "",
//         metaDescription: searchContent.meta_description || "",
//         seoContent: searchContent.seo_content || "",
//       });
//       setSelectedCity(searchContent.city || "Hyderabad");
//       setSelectedState(searchContent.state || "Telangana");
//       setSelectedArea(searchContent.areaName || "");
//       setSelectedPincode(searchContent.pincode || "");
//       setSelectedSubArea("");
//       const category = categories.find((cat) => cat._id === searchContent.categoryId);
//       if (category) {
//         setSelectedCategory({
//           name: category.category_name,
//           slug: category.category_slug,
//           id: category._id,
//         });
//       }
//     }
//     setError(null);
//   };

//   // Quill editor modules and formats
//   const modules = {
//     toolbar: [
//       [{ header: [1, 2, 3, false] }],
//       ["bold", "italic", "underline", "strike"],
//       [{ list: "ordered" }, { list: "bullet" }],
//       ["link"],
//       ["clean"],
//     ],
//   };

//   const formats = [
//     "header",
//     "bold",
//     "italic",
//     "underline",
//     "strike",
//     "list",
//     "bullet",
//     "link",
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
//               <BookOpen className="h-6 w-6 text-white" />
//             </div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//               Edit Meta Info
//             </h1>
//           </div>
//           <button
//             onClick={() => navigate(-1)}
//             className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-8">
//           {/* Search Selection Section */}
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//               <h2 className="text-lg font-semibold text-white">
//                 Search Selection
//               </h2>
//             </div>

//             <div className="p-6 space-y-6">
//               {error && <div className="text-red-500 mb-4">{error}</div>}
//               {categoriesLoading && <div className="text-gray-500 mb-4">Loading categories...</div>}
//               {categoriesError && <div className="text-red-500 mb-4">{categoriesError}</div>}

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Category Dropdown */}
//                 <div className="relative">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Category <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
//                     value={selectedCategory.name}
//                     onChange={handleCategoryChange}
//                     required
//                   >
//                     <option value="" disabled>
//                       Select Category
//                     </option>
//                     {categories
//                       .filter((cat) => cat.status === 1)
//                       .sort((a, b) => a.category_name.toLowerCase().localeCompare(b.category_name.toLowerCase()))
//                       .map((cat, idx) => (
//                         <option key={idx} value={cat.category_name}>
//                           {cat.category_name}
//                         </option>
//                       ))}
//                   </select>
//                   <BiSolidCategory
//                     className="absolute left-3 top-[38px] text-blue-400"
//                     size={20}
//                   />
//                 </div>

//                 {/* City Dropdown */}
//                 <div className="relative">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     City <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
//                     value={selectedCity}
//                     onChange={(e) => setSelectedCity(e.target.value)}
//                     required
//                   >
//                     <option value="" disabled>
//                       Select City
//                     </option>
//                     {cityOptions.map((city, idx) => (
//                       <option key={idx} value={city}>
//                         {city}
//                       </option>
//                     ))}
//                   </select>
//                   <MapPin
//                     className="absolute left-3 top-[38px] text-blue-400"
//                     size={20}
//                   />
//                 </div>

//                 {/* Area Dropdown */}
//                 <div className="relative">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Area <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
//                     value={selectedArea}
//                     onChange={handleAreaChange}
//                     required
//                   >
//                     <option value="" disabled>
//                       Select Area
//                     </option>
//                     {areaOptions
//                       .sort((a, b) => a.name.localeCompare(b.name))
//                       .map((area, idx) => (
//                         <option key={idx} value={area.name}>
//                           {area.name} - {area.pincode}
//                         </option>
//                       ))}
//                   </select>
//                   <MapPin
//                     className="absolute left-3 top-[38px] text-blue-400"
//                     size={20}
//                   />
//                 </div>

//                 {/* Subarea Dropdown */}
//                 <div className="relative">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Subarea
//                   </label>
//                   <select
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
//                     value={selectedSubArea}
//                     onChange={(e) => setSelectedSubArea(e.target.value)}
//                     disabled={!subAreaOptions.length}
//                   >
//                     <option value="" disabled>
//                       Select Subarea
//                     </option>
//                     {subAreaOptions.map((sub, idx) => (
//                       <option key={sub._id || idx} value={sub.name}>
//                         {sub.name}
//                       </option>
//                     ))}
//                   </select>
//                   <MapPin
//                     className="absolute left-3 top-[38px] text-blue-400"
//                     size={20}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Meta Information */}
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//               <h2 className="text-lg font-semibold text-white">
//                 Meta Information
//               </h2>
//             </div>

//             <div className="p-6 space-y-6">
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Meta Title <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="metaTitle"
//                   value={formData.metaTitle}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                   placeholder="Enter meta title"
//                   required
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Meta Description <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   name="metaDescription"
//                   value={formData.metaDescription}
//                   onChange={handleInputChange}
//                   rows={3}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                   placeholder="Enter meta description"
//                   required
//                 />
//               </div>
//             </div>
//           </div>

//           {/* SEO Content */}
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//               <h2 className="text-lg font-semibold text-white">SEO Content</h2>
//             </div>

//             <div className="p-6">
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   SEO Content <span className="text-red-500">*</span>
//                 </label>
//                 <ReactQuill
//                   value={formData.seoContent}
//                   onChange={handleSeoContentChange}
//                   modules={modules}
//                   formats={formats}
//                   placeholder="Write your SEO content here..."
//                   className="bg-white rounded-lg"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//             <div className="flex gap-3 w-full sm:w-auto">
//               <button
//                 type="button"
//                 onClick={handleReset}
//                 className="w-full sm:w-auto flex items-center gap-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
//               >
//                 <RefreshCw className="h-5 w-5" />
//                 Reset
//               </button>
//             </div>
//             <button
//               type="submit"
//               className="w-full sm:w-auto flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
//             >
//               Update
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditMetaInfo;