class IssueBoard < ApplicationRecord
	belongs_to :user, optional: true
	belongs_to :group, optional: true
	has_many :issue_labels, dependent: :destroy

	validates :name, presence: true
	validate :either_user_or_group?


	private

	def either_user_or_group?
		errors.add("either group or user must be defined, not both") if 
		((user.nil? && group.nil?) || (user.present? && group.present?))
	end
end
