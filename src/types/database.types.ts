/**
 * Supabase database types.
 *
 * Hand-authored to mirror `supabase/migrations/0001_init.sql` so the app is
 * fully typed from day one. Once the Supabase CLI is wired up, regenerate this
 * file from the live schema with:  `npm run db:types`.
 *
 * The shape follows the Supabase convention: Row (select), Insert, Update.
 */

export type CourseLevel = 'UG' | 'PG';
export type NoticeKind = 'notice' | 'event';
export type EnquiryStatus = 'new' | 'read' | 'resolved';

export interface Database {
  public: {
    Tables: {
      courses: {
        Row: {
          id: string;
          name: string;
          /** URL key for /courses/<slug> — unique. See migration 0003. */
          slug: string;
          level: CourseLevel;
          duration: string;
          tagline: string;
          about: string;
          seats: number;
          fee: string;
          subjects: string[];
          eligibility: string;
          careers: string[];
          sort_order: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          level: CourseLevel;
          duration: string;
          tagline: string;
          about: string;
          seats: number;
          fee: string;
          subjects?: string[];
          eligibility: string;
          careers?: string[];
          sort_order?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['courses']['Insert']>;
        Relationships: [];
      };
      faculty: {
        Row: {
          id: string;
          name: string;
          designation: string;
          department: string;
          qualification: string | null;
          email: string | null;
          photo_url: string | null;
          bio: string | null;
          sort_order: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          designation: string;
          department: string;
          qualification?: string | null;
          email?: string | null;
          photo_url?: string | null;
          bio?: string | null;
          sort_order?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['faculty']['Insert']>;
        Relationships: [];
      };
      notices: {
        Row: {
          id: string;
          title: string;
          kind: NoticeKind;
          body: string | null;
          location: string | null;
          published_at: string;
          is_pinned: boolean;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          kind: NoticeKind;
          body?: string | null;
          location?: string | null;
          published_at?: string;
          is_pinned?: boolean;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['notices']['Insert']>;
        Relationships: [];
      };
      gallery_images: {
        Row: {
          id: string;
          title: string;
          image_url: string;
          category: string | null;
          sort_order: number;
          is_published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          image_url: string;
          category?: string | null;
          sort_order?: number;
          is_published?: boolean;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['gallery_images']['Insert']>;
        Relationships: [];
      };
      downloads: {
        Row: {
          id: string;
          name: string;
          file_url: string;
          file_type: string;
          size_label: string | null;
          category: string | null;
          sort_order: number;
          is_published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          file_url: string;
          file_type?: string;
          size_label?: string | null;
          category?: string | null;
          sort_order?: number;
          is_published?: boolean;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['downloads']['Insert']>;
        Relationships: [];
      };
      site_settings: {
        Row: {
          key: string;
          value: string | null;
          updated_at: string;
        };
        Insert: {
          key: string;
          value?: string | null;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['site_settings']['Insert']>;
        Relationships: [];
      };
      enquiries: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          subject: string | null;
          message: string;
          status: EnquiryStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          subject?: string | null;
          message: string;
          status?: EnquiryStatus;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['enquiries']['Insert']>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      /** Rate-limited enquiry insert — see supabase/enquiry_cooldown.sql. */
      submit_enquiry: {
        Args: {
          p_name: string;
          p_email: string;
          p_phone: string | null;
          p_subject: string | null;
          p_message: string;
        };
        Returns: { ok: boolean; wait_minutes: number };
      };
      /** True when the caller's user id is in the admins allow-list —
       *  see supabase/migrations/0002_admin_roles.sql. */
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      /** Login brute-force throttle — see supabase/migrations/0004_login_throttle.sql. */
      login_cooldown_remaining: {
        Args: { p_ip: string };
        Returns: number;
      };
      record_login_failure: {
        Args: { p_ip: string };
        Returns: undefined;
      };
      clear_login_failures: {
        Args: { p_ip: string };
        Returns: undefined;
      };
    };
    Enums: {
      course_level: CourseLevel;
      notice_kind: NoticeKind;
      enquiry_status: EnquiryStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}

/** Convenience row aliases used across features. */
export type Course = Database['public']['Tables']['courses']['Row'];
export type Faculty = Database['public']['Tables']['faculty']['Row'];
export type Notice = Database['public']['Tables']['notices']['Row'];
export type GalleryImage = Database['public']['Tables']['gallery_images']['Row'];
export type Download = Database['public']['Tables']['downloads']['Row'];
export type Enquiry = Database['public']['Tables']['enquiries']['Row'];
