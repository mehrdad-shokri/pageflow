module Pageflow
  # Concern that can be included in entry type specific controllers
  # that extend the REST interface used by the editor. Handles
  # authentication, entry lookup, authorization and edit locking.
  #
  # @since edge
  module EditorController
    extend ActiveSupport::Concern

    include EditLocking

    included do
      before_action :authenticate_user!

      before_action do
        begin
          @entry = DraftEntry.find(params[:entry_id])
        rescue ActiveRecord::RecordNotFound
          head :not_found
        end
      end

      before_action do
        begin
          Ability.new(current_user).authorize!(:update, @entry.to_model)
        rescue CanCan::AccessDenied
          head :forbidden
        end
      end

      before_action do
        verify_edit_lock!(@entry)
      end

      before_action do
        head :bad_request if params[:entry_type] && @entry.entry_type.name != params[:entry_type]
      end
    end
  end
end
